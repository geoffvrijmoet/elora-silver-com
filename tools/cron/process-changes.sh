#!/bin/zsh -l
# Elora Silver website change processor
# Runs hourly, checks MongoDB for pending change requests.
# If found, uses Claude CLI to implement changes, pushes preview branch.

PROJECT_DIR="/Users/geofferyvrijmoet/Sites/elora-silver"
SITE_DIR="$PROJECT_DIR/apps/web"
CLAUDE="/opt/homebrew/bin/claude"
NODE="/opt/homebrew/bin/node"
LOG_DIR="$PROJECT_DIR/tools/cron/logs"
HELPERS_DIR="$PROJECT_DIR/tools/cron/helpers"
PROMPTS_DIR="$PROJECT_DIR/tools/cron/prompts"
TODAY=$(date +%Y-%m-%d)
NOW=$(date +%Y-%m-%dT%H:%M:%S)
STATUS_FILE="$LOG_DIR/.status-process-changes"
PROGRESS_FILE="$LOG_DIR/.progress-process-changes"

# Load env vars from .env.local (parse key=value lines, skip comments)
while IFS='=' read -r key value; do
  [[ "$key" =~ ^#.*$ || -z "$key" ]] && continue
  key=$(echo "$key" | xargs)
  export "$key"="$value"
done < "$PROJECT_DIR/apps/admin/.env.local"

mkdir -p "$LOG_DIR"

# Time gate: only run between 7am and 11pm
HOUR=$(date +%H)
if [ "$HOUR" -lt 7 ] || [ "$HOUR" -ge 23 ]; then
  exit 0
fi

# Lock file to prevent concurrent runs
LOCK="/tmp/elorasilver-process-changes.lock"
if [ -f "$LOCK" ]; then
  if [ "$(find "$LOCK" -mmin +30 2>/dev/null)" ]; then
    rm -f "$LOCK"
  else
    echo "[$TODAY $(date +%H:%M)] process-changes: locked, skipping" >> "$LOG_DIR/cron.log"
    exit 0
  fi
fi
trap "rm -f $LOCK" EXIT
touch "$LOCK"

# Check MongoDB for actionable sessions
echo "Checking..." > "$PROGRESS_FILE"
SESSION_FILE=$(mktemp /tmp/elora-session-XXXXXX.json)
trap "rm -f $LOCK $SESSION_FILE" EXIT

$NODE "$HELPERS_DIR/check-sessions.js" > "$SESSION_FILE" 2>> "$LOG_DIR/process-changes-${TODAY}.log"

if [ $? -ne 0 ] || [ ! -s "$SESSION_FILE" ]; then
  echo "[$TODAY $(date +%H:%M)] process-changes: failed to check MongoDB" >> "$LOG_DIR/cron.log"
  exit 1
fi

ACTION=$(/usr/bin/jq -r '.action' < "$SESSION_FILE")

if [ "$ACTION" = "none" ]; then
  echo "[$TODAY $(date +%H:%M)] process-changes: no actionable sessions" >> "$LOG_DIR/cron.log"
  echo "No work." > "$PROGRESS_FILE"
  exit 0
fi

SESSION_ID=$(/usr/bin/jq -r '.id' < "$SESSION_FILE")
BRANCH=$(/usr/bin/jq -r '.branch' < "$SESSION_FILE")

echo "{\"job\":\"process-changes\",\"status\":\"running\",\"action\":\"$ACTION\",\"sessionId\":\"$SESSION_ID\",\"startedAt\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "$STATUS_FILE"
echo "[$TODAY $(date +%H:%M)] process-changes: starting ($ACTION) session=$SESSION_ID" >> "$LOG_DIR/cron.log"

cd "$PROJECT_DIR"

# ── APPROVED: merge to main ──
if [ "$ACTION" = "approved" ]; then
  echo "Merging $BRANCH to main..." > "$PROGRESS_FILE"
  $NODE "$HELPERS_DIR/update-session.js" "$SESSION_ID" "processing" --system-message "Merging changes to production..."

  git checkout main && git pull origin main
  if git merge preview --no-edit 2>> "$LOG_DIR/process-changes-${TODAY}.log"; then
    git push origin main 2>> "$LOG_DIR/process-changes-${TODAY}.log"

    $NODE "$HELPERS_DIR/update-session.js" "$SESSION_ID" "deployed" --system-message "Changes deployed to production."
    $NODE "$HELPERS_DIR/send-email.js" \
      "Your Website Changes Are Live!" \
      "Hi Elora,\n\nThe changes you approved have been deployed to your website.\nThey're now live at https://elorasilver.com\n\nVisit your dashboard: https://admin.elorasilver.com/dashboard"

    echo "{\"job\":\"process-changes\",\"status\":\"completed\",\"action\":\"deployed\",\"completedAt\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "$STATUS_FILE"
    echo "Done." > "$PROGRESS_FILE"
    echo "[$TODAY $(date +%H:%M)] process-changes: deployed session=$SESSION_ID" >> "$LOG_DIR/cron.log"
    osascript -e 'display notification "Changes deployed to production" with title "Elora Silver" sound name "Glass"' 2>/dev/null
  else
    git merge --abort 2>/dev/null
    git checkout main 2>/dev/null
    $NODE "$HELPERS_DIR/update-session.js" "$SESSION_ID" "failed" --system-message "Failed to merge changes to production."
    echo "{\"job\":\"process-changes\",\"status\":\"failed\",\"failedAt\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "$STATUS_FILE"
    echo "FAILED" > "$PROGRESS_FILE"
    echo "[$TODAY $(date +%H:%M)] process-changes: FAILED merge session=$SESSION_ID" >> "$LOG_DIR/cron.log"
    osascript -e 'display notification "Failed to merge changes" with title "Elora Silver" sound name "Basso"' 2>/dev/null
  fi
  exit 0
fi

# ── PENDING or FEEDBACK_PENDING: implement changes via Claude ──
echo "Processing changes..." > "$PROGRESS_FILE"
$NODE "$HELPERS_DIR/update-session.js" "$SESSION_ID" "processing" --system-message "Working on your changes..."

# Always use the preview branch
BRANCH="preview"
git checkout main && git pull origin main
# Reset preview branch to current main, then apply changes on top
git branch -D preview 2>/dev/null
git checkout -b preview 2>> "$LOG_DIR/process-changes-${TODAY}.log"

# Build the prompt with message history
MESSAGES=$(/usr/bin/jq -r '.messages[] | "\(.role) (\(.createdAt)): \(.content)"' < "$SESSION_FILE")
PROMPT_TEMPLATE=$(cat "$PROMPTS_DIR/website-change.md")
FULL_PROMPT="${PROMPT_TEMPLATE//\{CHANGE_REQUEST_MESSAGES\}/$MESSAGES}"

# Clean up any previous summary
rm -f /tmp/elora-change-summary.txt

# Run Claude
echo "Running Claude..." > "$PROGRESS_FILE"
if $CLAUDE -p "$FULL_PROMPT" \
  --model claude-opus-4-6 \
  --allowedTools "Bash,Read,Write,Edit,Glob,Grep" \
  --max-turns 50 \
  >> "$LOG_DIR/process-changes-${TODAY}.log" 2>&1; then

  # Read the change summary
  SUMMARY="Changes implemented."
  if [ -f /tmp/elora-change-summary.txt ]; then
    SUMMARY=$(cat /tmp/elora-change-summary.txt)
  fi

  # Check if there are actual changes to commit
  if git diff --quiet && git diff --cached --quiet; then
    echo "No file changes detected" >> "$LOG_DIR/process-changes-${TODAY}.log"
    $NODE "$HELPERS_DIR/update-session.js" "$SESSION_ID" "failed" --system-message "Claude ran but made no file changes."
    git checkout main 2>/dev/null
    echo "FAILED - no changes" > "$PROGRESS_FILE"
    exit 1
  fi

  # Commit and push
  echo "Pushing changes..." > "$PROGRESS_FILE"
  git add -A
  git commit -m "feat: website changes for session $SESSION_ID

$SUMMARY

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"

  git push -u origin preview --force 2>> "$LOG_DIR/process-changes-${TODAY}.log"

  # Preview URL via custom domain
  PREVIEW_URL="https://preview.elorasilver.com"

  # Wait for Vercel deployment to be ready (up to 5 minutes)
  echo "Waiting for Vercel deployment..." > "$PROGRESS_FILE"
  DEPLOY_READY=false
  for i in $(seq 1 30); do
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PREVIEW_URL")
    # 200 means deployed, 404/502/503 mean still building
    if [ "$HTTP_STATUS" = "200" ]; then
      DEPLOY_READY=true
      break
    fi
    sleep 10
  done

  if [ "$DEPLOY_READY" = false ]; then
    echo "Warning: Vercel deployment not ready after 5 minutes, sending URL anyway" >> "$LOG_DIR/process-changes-${TODAY}.log"
  fi

  # Update MongoDB - include preview URL in the message itself
  $NODE "$HELPERS_DIR/update-session.js" "$SESSION_ID" "preview_ready" \
    --preview-url "$PREVIEW_URL" \
    --branch "$BRANCH" \
    --summary "$SUMMARY" \
    --system-message "${SUMMARY}

Preview: ${PREVIEW_URL}"

  # Send email
  $NODE "$HELPERS_DIR/send-email.js" \
    "Website Update Ready for Review" \
    "Hi Elora,\n\nI've made the changes you requested to your website. Here's a summary:\n\n${SUMMARY}\n\nYou can preview the changes here:\n${PREVIEW_URL}\n\nWhen you're ready, visit your admin dashboard to approve the changes or request adjustments:\nhttps://admin.elorasilver.com/dashboard"

  echo "{\"job\":\"process-changes\",\"status\":\"completed\",\"action\":\"preview_ready\",\"completedAt\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "$STATUS_FILE"
  echo "Done." > "$PROGRESS_FILE"
  echo "[$TODAY $(date +%H:%M)] process-changes: preview ready session=$SESSION_ID" >> "$LOG_DIR/cron.log"
  osascript -e 'display notification "Website changes ready for preview" with title "Elora Silver" sound name "Glass"' 2>/dev/null

else
  # Claude failed
  $NODE "$HELPERS_DIR/update-session.js" "$SESSION_ID" "failed" --system-message "Failed to implement changes. An error occurred during processing."
  git checkout main 2>/dev/null
  echo "{\"job\":\"process-changes\",\"status\":\"failed\",\"failedAt\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "$STATUS_FILE"
  echo "FAILED" > "$PROGRESS_FILE"
  echo "[$TODAY $(date +%H:%M)] process-changes: FAILED session=$SESSION_ID" >> "$LOG_DIR/cron.log"
  osascript -e 'display notification "Failed to process website changes" with title "Elora Silver" sound name "Basso"' 2>/dev/null
fi

# Always return to main
git checkout main 2>/dev/null
