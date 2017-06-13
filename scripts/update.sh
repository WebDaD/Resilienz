#!/bin/sh
git pull
npm install
sh scripts/createui.sh
sh scripts/minifyui.sh
