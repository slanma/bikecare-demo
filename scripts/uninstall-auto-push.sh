#!/bin/zsh
set -euo pipefail

LABEL="cz.bikecare.git-autopush"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"

launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
rm -f "$PLIST"
echo "Automatický push byl vypnut."
