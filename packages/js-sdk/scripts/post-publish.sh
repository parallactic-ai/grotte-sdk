#!/usr/bin/env bash

npm pkg set 'name'='@grotte/sdk'
npm publish --no-git-checks
npm pkg set 'name'='grotte'
npm deprecate "@grotte/sdk@$(npm pkg get version | tr -d \")" "The package @grotte/sdk has been renamed to grotte. Please uninstall the old one and install the new by running following command: npm uninstall @grotte/sdk && npm install grotte"
