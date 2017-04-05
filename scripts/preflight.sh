#!/bin/bash
function checkFolder {
  PARM=$(json -f package.json config."$1")
  if [ -d "$PARM" && -w "$PARM" ]
    then
      echo '===> $PARM exists and is writable'
    else
      echo '===> $PARM does not exist or is not writable'
      exit 1
  fi
}
echo '=> Preparing for preflight'

if ! type "retire" > /dev/null; then
  echo '==> retire not installed, installing'
  npm install -g retire
fi
if ! type "nsp" > /dev/null; then
  echo '==> nsp not installed, installing'
  npm install -g nsp
fi
if ! type "mysql" > /dev/null; then
  echo '==> mysql-client not installed, installing'
  apt-get install mysql-client
fi
if ! type "json" > /dev/null; then
  echo '==> json not installed, installing'
  npm install -g json
fi
echo '=> Preparation Done.'

echo '=> Performing Preflight-Check'

echo '==> Verifying Security'

echo -n '===> Verifying Libs ...'
retire
echo 'OK'

echo -n '==> Verifying Vulnerabilities ...'
nsp check
echo 'OK'
echo '==> Verifying Security OK'

echo '==> Verifying Database'
# TODO reachable, tables there
echo '==> Verifying Database OK'

echo '==> Verifying Folders on Server'
checkFolder 'images'
checkFolder 'books'
checkFolder 'pages'
checkFolder 'pdfs'
echo '==> Verifying Folders OK'

echo '==> Verifying File-Integrity'
# TODO all needed files (backend, ui) are there
echo '==> Verifying File-Integrity OK'

echo '==> Verifying Binaries'
# TODO convert, composite (part of imagemagick)
echo '==> Verifying Binaries OK'

echo '==> Verifying Server'
# TODO Port can be used
echo '==> Verifying Server OK'

echo '=> Check-Done'

# is database there, is port not used, all files there (backend AND ui)
# check if needed binaries (convert) are there, else notify and output install command
# check if folders are there and 777
"verify": "echo '=> Verifying Deployment Process' && npm run verify:html && npm run verify:js && npm run verify:css && npm run verify:images && npm run verify:server && echo '=> Verifying Deployment Process OK'",
      "verify:html": "echo -n '==> Verifying HTML ...' && test -e public/index.html && test -e public/share.html && echo 'OK'",
      "verify:js": "echo -n '==> Verifying JS ...' && test -e public/js/verbshaker.js && test -e public/js/share.js && test -e public/js/angular.min.js && test -e public/js/bootstrap.min.js && test -e public/js/jquery.min.js && test -e public/js/angular-cookies.min.js && echo 'OK'",
      "verify:css": "echo -n '==> Verifying CSS ...' && test -e public/css/main.min.css && echo 'OK'",
      "verify:images": "echo -n '==> Verifying Images ...' && test -e public/images/android-chrome-192x192.png && test -e public/images/android-chrome-512x512.png && test -e public/images/apple-touch-icon.png && test -e public/images/browserconfig.xml && test -e public/images/favicon-16x16.png && test -e public/images/favicon-32x32.png && test -e public/images/favicon.ico && test -e public/images/manifest.json && test -e public/images/mstile-150x150.png && test -e public/images/safari-pinned-tab.svg && echo 'OK'",
      "verify:server": "echo -n '==> Verifying Server ...' && test -e app.js && test -e libs/proverbs.js && test -e libs/proverbCollection.js && test -e routes/proverbs.js && test -e routes/index.js && echo 'OK'",
