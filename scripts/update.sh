#!/bin/sh
git pull
sh scripts/createui.sh
sh scripts/minifyui.sh
