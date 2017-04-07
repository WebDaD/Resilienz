#!/bin/bash
echo '=> Preparing to create Docs'

if ! type "rsync" > /dev/null; then
  echo '==> rsync not installed, installing'
  apt-get install rsync
fi
if ! type "markdown-html" > /dev/null; then
  echo '==> markdown-html not installed, installing'
  npm install -g markdown-html
fi
if ! type "raml2html" > /dev/null; then
  echo '==> raml2html not installed, installing'
  npm install -g raml2html
fi
if ! type "jsdoc" > /dev/null; then
  echo '==> jsdoc not installed, installing'
  npm install -g jsdoc
fi
echo '=> Preparation Done.'

echo '=> Creating Docs'

echo -n '==> Creating Coverage ...'
rsync -avq coverage/ doc/coverage/
rm -rf coverage/
echo 'OK'

echo -n '==> Creating HTML ...'
markdown-html README.md -o doc/readme.html >/dev/null 2>&1
echo 'OK'

echo -n '==> Creating Testreports ...'
rsync -avq mochawesome-reports/ docs/mochawesome-reports/
rm -rf mochawesome-reports/
echo 'OK'

echo -n '==> Creating API-Doc ...'
raml2html doc/api.raml > doc/rest.html
echo 'OK'

echo -n '==> Creating JSDoc ...'
jsdoc lib/* routes/* tests/* app.js -d doc/jsdoc/
echo 'OK'

echo -n '==> Creating Manuals ...'
markdown-html doc/manuals/user.md -o doc/manual_user.html >/dev/null 2>&1
markdown-html doc/manuals/admin.md -o doc/manual_admin.html >/dev/null 2>&1
echo 'OK'


# TODO: parse puml files

echo '=> Creating Docs OK'
