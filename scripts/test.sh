#!/bin/bash
echo '=> Preparing to Test'

if ! type "pug-lint" > /dev/null; then
  echo '==> pug-lint not installed, installing'
  npm install -g pug-lint
fi
if ! type "lessc" > /dev/null; then
  echo '==> lessc not installed, installing'
  npm install -g lessc
fi
if ! type "standard" > /dev/null; then
  echo '==> standard not installed, installing'
  npm install -g standard
fi
if ! type "istanbul" > /dev/null; then
  echo '==> istanbul not installed, installing'
  npm install -g istanbul mocha mochawesome
fi
echo '=> Preparation Done.'

echo '=> Linting Files'
echo -n '==> Linting PUG-Files ...'
pug-lint templates/**/*.pug
echo 'OK'
echo -n '==> Linting LESS-Files ...'
lessc --lint assets/css/*.less
echo 'OK'
echo -n '==> Linting JS-Files ...'
standard \"assets/**/*.js\" \"tests/*.js\" app.js \"lib/*.js\" \"routes/*.js\"
echo 'OK'

echo '=> Linting Files OK'

echo '=> Perfoming Tests'
istanbul cover _mocha -- tests/*.js -R mochawesome
echo '==> LoadTest'
node tests/loadtest.js
echo 'OK'
echo '=> Perfoming Tests OK'
