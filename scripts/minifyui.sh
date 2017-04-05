#!/bin/bash
echo '=> Preparing to minify Website Assets'

if ! type "uglifyjs" > /dev/null; then
  echo '==> uglify-js not installed, installing'
  npm install -g uglify-js
fi
if ! type "uglifycss" > /dev/null; then
  echo '==> uglifycss not installed, installing'
  npm install -g uglifycss
fi
if ! type "imagemin" > /dev/null; then
  echo '==> imagemin not installed, installing'
  npm install -g imagemin-cli
fi
echo '=> Preparation Done.'

echo '=> Minifying Files'
echo -n '==> Minifying JS ...'
uglifyjs public/js/* public/js/controllers/* -o public/js/js.min.js -p 5 -c -m
echo 'OK'

echo -n '==> Minifying CSS ...'
uglifycss public/css/* > public/css/css.min.css
echo 'OK'

echo -n '==> Minifying Images ...'
imagemin public/images/* --out-dir=public/images
echo 'OK'

echo '=> Minifying Files OK'
