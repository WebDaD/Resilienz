#!/bin/bash
echo '=> Installing needed global Packages'
npm install -g pm2
apt-get install imagemagick
echo '=> Installation OK'
pm2 startup
