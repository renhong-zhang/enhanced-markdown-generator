#!/bin/bash

# `Compile and Install the Generator with the following Code
# *Uninstall Previous Version
npm uninstall @renhong-zhang/enhanced-markdown-generator -g
npm uninstall enhanced-markdown-generator -g

# ~ You Can Make Clean Install by Un-Comment the Following Lines
# rm -rf node_modules/
# rm package-lock.json

# *Make Sure ./dist/ exists
mkdir -p dist/

# *Install Packages
npm install

# *Generate JS files
npm run refresh

# *Install
rm *.tgz
npm pack
npm install --global *.tgz
npx which mdgen

echo ""
echo "Installation completes at:"
date +%Y-%m-%d\ %H:%M:%S
