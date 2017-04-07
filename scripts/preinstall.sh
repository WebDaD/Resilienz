#!/bin/bash
echo '=> Installing needed global Packages'
npm install -g pm2
apt-get install imagemagick python g++
echo '=> Installation OK'
pm2 startup
