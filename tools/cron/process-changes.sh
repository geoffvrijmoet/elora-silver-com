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
SESSION_JSON=$($NODE "$HELPERS_DIR/check-sessions.js" 2>> "$LOG_DIR/process-changes-${TODAY}.log")

if [ $? -ne 0 ] || [ -z "$SESSION_JSON" ]; then
  echo "[$TODAY $(date +%H:%M)] process-changes: failed to check MongoDB" >> "$LOG_DIR/cron.log"
  exit 1
fi

ACTION=$(echo "$SESSION_JSON" | /usr/bin/jq -r '.action')

if [ "$ACTION" = "none" ]; then
  echo "[$TODAY $(date +%H:%M)] process-changes: no actionable sessions" >> "$LOG_DIR/cron.log"
  echo "No work." > "$PROGRESS_FILE"
  exit 0
fi

SESSION_ID=$(echo "$SESSION_JSON" | /usr/bin/jq -r '.id')
BRANCH=$(echo "$SESSION_JSON" | /usr/bin/jq -r '.branch')

echo "{\"job\":\"process-changes\",\"status\":\"running\",\"action\":\"$ACTION\",\"sessionId\":\"$SESSION_ID\",\"startedAt\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "$STATUS_FILE"
echo "[$TODAY $(date +%H:%M)] process-changes: starting ($ACTION) session=$SESSION_ID" >> "$LOG_DIR/cron.log"

cd "$PROJECT_DIR"

# ── APPROVED: merge to main ──
if [ "$ACTION" = "approved" ]; then
  echo "Merging $BRANCH to main..." > "$PROGRESS_FILE"
  $NODE "$HELPERS_DIR/update-session.js" "$SESSION_ID" "processing" --system-message "Merging changes to production..."

  git checkout main && git pull origin main
  if git merge "$BRANCH" --no-edit 2>> "$LOG_DIR/process-changes-${TODAY}.log"; then
    git push origin main 2>> "$LOG_DIR/process-changes-${TODAY}.log"
    git branch -d "$BRANCH" 2>/dev/null
    git push origin --delete "$BRANCH" 2>/dev/null

    $NODE "$HELPERS_DIR/update-session.js" "$SESSION_ID" "deployed" --system-message "Changes deployed to production."
    $NODE "$HELPERS_DIR/send-email.js" \
      "Your Website Changes Are Live!" \
      "Hi Elora,\n\nThe changes you approved have been deployed to your website.\nThey're now live at https://elorasilver.com\n\nYou can see the details at https://admin.elorasilver.com/dashboard/sessions/$SESSION_ID"

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

# Set up the branch
if [ "$ACTION" = "pending" ]; then
  git checkout main && git pull origin main
  git checkout -b "$BRANCH" 2>> "$LOG_DIR/process-changes-${TODAY}.log"
elif [ "$ACTION" = "feedback_pending" ]; then
  git checkout "$BRANCH" && git pull origin "$BRANCH" 2>/dev/null
fi

# Build the prompt with message history
MESSAGES=$(echo "$SESSION_JSON" | /usr/bin/jq -r '.messages[] | "\(.role) (\(.createdAt)): \(.content)"')
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

  git push -u origin "$BRANCH" 2>> "$LOG_DIR/process-changes-${TODAY}.log"

  # Construct the Vercel preview URL
  SANITIZED_BRANCH=$(echo "$BRANCH" | tr '/' '-')
  PREVIEW_URL="https://elora-silver-com-git-${SANITIZED_BRANCH}-geoff-vrijmoets-projects.vercel.app"

  # Update MongoDB
  $NODE "$HELPERS_DIR/update-session.js" "$SESSION_ID" "preview_ready" \
    --preview-url "$PREVIEW_URL" \
    --branch "$BRANCH" \
    --summary "$SUMMARY" \
    --system-message "Changes are ready for review."

  # Send email
  $NODE "$HELPERS_DIR/send-email.js" \
    "Website Update Ready for Review" \
    "Hi Elora,\n\nI've made the changes you requested to your website. Here's a summary:\n\n${SUMMARY}\n\nYou can preview the changes here:\n${PREVIEW_URL}\n\nWhen you're ready, visit your admin dashboard to approve the changes or request adjustments:\nhttps://admin.elorasilver.com/dashboard/sessions/$SESSION_ID"

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
