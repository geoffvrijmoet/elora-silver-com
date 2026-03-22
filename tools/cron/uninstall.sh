#!/bin/bash
# Uninstall Elora Silver change processor LaunchAgent
set -euo pipefail

LAUNCH_DIR="$HOME/Library/LaunchAgents"
AGENT="com.elorasilver.process-changes"

echo "Uninstalling Elora Silver change processor..."

launchctl bootout "gui/$(id -u)/$AGENT" 2>/dev/null || true
rm -f "$LAUNCH_DIR/$AGENT.plist"

echo "  Removed: $AGENT"
echo "Done."
