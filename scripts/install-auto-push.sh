#!/bin/zsh
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
LABEL="cz.bikecare.git-autopush"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
SCRIPT="$REPO/scripts/auto-push.sh"

mkdir -p "$HOME/Library/LaunchAgents"
chmod +x "$SCRIPT"

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key><array><string>/bin/zsh</string><string>$SCRIPT</string></array>
  <key>StartInterval</key><integer>30</integer>
  <key>RunAtLoad</key><true/>
  <key>ProcessType</key><string>Background</string>
</dict></plist>
EOF

launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
launchctl kickstart -k "gui/$(id -u)/$LABEL"

echo "Automatický push je aktivní."
echo "Repozitář: $REPO"
echo "Log: $REPO/.git/auto-push/auto-push.log"
