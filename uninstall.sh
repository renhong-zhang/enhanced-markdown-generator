#!/bin/bash

# `Uninstall the Generator with the following Code
# *Uninstall Previous Version
npm uninstall @renhong-zhang/enhanced-markdown-generator -g
npm uninstall enhanced-markdown-generator -g

rm package-lock.json
rm *.tgz

echo ""
echo "Uninstallation completes at:"
date +%Y-%m-%d\ %H:%M:%S
