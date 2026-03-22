#!/bin/bash
# Install Elora Silver change processor via macOS LaunchAgent
set -euo pipefail

CRON_DIR="$(cd "$(dirname "$0")" && pwd)"
PLIST_DIR="$CRON_DIR/plists"
LAUNCH_DIR="$HOME/Library/LaunchAgents"
AGENT="com.elorasilver.process-changes"

echo "Installing Elora Silver change processor (launchd)..."
echo "  Script: $CRON_DIR/process-changes.sh"
echo ""

# Make script executable
chmod +x "$CRON_DIR/process-changes.sh"

# Ensure log directory exists
mkdir -p "$CRON_DIR/logs"

# Unload if already loaded
launchctl bootout "gui/$(id -u)/$AGENT" 2>/dev/null || true

# Copy plist to LaunchAgents
cp "$PLIST_DIR/$AGENT.plist" "$LAUNCH_DIR/$AGENT.plist"

# Load
launchctl bootstrap "gui/$(id -u)" "$LAUNCH_DIR/$AGENT.plist"

echo "  Loaded: $AGENT"
echo ""
echo "Installed! Schedule: :07 past each hour, 7am-11pm"
echo "Checks MongoDB for pending change requests each hour."
echo "Logs: $CRON_DIR/logs/"
echo ""
echo "To verify: launchctl list | grep elorasilver"
echo "To remove: $CRON_DIR/uninstall.sh"
