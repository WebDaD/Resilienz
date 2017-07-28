#!/bin/bash
echo '=> Preparing to deploy Website Assets'

if ! type "bower" > /dev/null; then
  echo '==> bower not installed, installing'
  npm install -g bower
fi
if ! type "lessc" > /dev/null; then
  echo '==> less not installed, installing'
  npm install -g less
fi
echo '=> Preparation Done.'
echo '=> Deploying Website Assets'

echo -n '==> Preparing Folders ...'
mkdir -p public
rm -rf public/*
mkdir -p public/templates
mkdir -p public/css
mkdir -p public/js
mkdir -p public/js/controllers
mkdir -p public/images
mkdir -p public/fonts
echo 'OK'

echo -n '==> Getting Bower Componentes'
bower install --allow-root
npm install ng-table --save
echo 'OK'

echo -n '==> Deploying jquery ...'
cp bower_components/jquery/dist/jquery.min.js public/js/jquery.min.js
echo 'OK'

echo -n '==> Deploying jquery.imgareaselect ...'
cp bower_components/imgareaselect/jquery.imgareaselect.dev.js public/js/jquery.imgareaselect.js
cp bower_components/imgareaselect/distfiles/css/imgareselect-animated.css public/css/imgareselect-animated.css
cp bower_components/imgareaselect/distfiles/css/border-anim-h.gif public/css/border-anim-h.gif
cp bower_components/imgareaselect/distfiles/css/border-anim-v.gif public/css/border-anim-v.gif
cp bower_components/imgareaselect/distfiles/css/border-h.gif public/css/border-h.gif
cp bower_components/imgareaselect/distfiles/css/border-v.gif public/css/border-v.gif
echo 'OK'

echo -n '==> Deploying jquery.cookie ...'
cp bower_components/jquery.cookie/jquery.cookie.js public/js/jquery.cookie.js
echo 'OK'

echo -n '==> Deploying jquery-md5 ...'
cp bower_components/jquery-md5/jquery.md5.js public/js/jquery.md5.js
echo 'OK'

echo -n '==> Deploying Bootstrap ...'
cp bower_components/bootstrap/dist/css/bootstrap.min.css public/css/bootstrap.min.css
echo 'OK'

echo -n '==> Deploying Font-Awesome ...'
cp bower_components/font-awesome/css/font-awesome.min.css public/css/font-awesome.min.css
cp bower_components/font-awesome/fonts/* public/fonts 2>>/dev/null
echo 'OK'

echo -n '==> Deploying angular'
cp bower_components/angular/angular.min.js public/js/angular.min.js
echo 'OK'

echo -n '==> Deploying angular-route ...'
cp bower_components/angular-route/angular-route.min.js public/js/angular-route.min.js
echo 'OK'

echo -n '==> Deploying angular-cookies ...'
cp bower_components/angular-cookies/angular-cookies.min.js public/js/angular-cookies.min.js
echo 'OK'

echo -n '==> Deploying angular-imgAreaSelect ...'
cp assets/js/ng-imgAreaSelect.min.js public/js/ng-imgAreaSelect.min.js
echo 'OK'

echo -n '==> Deploying angular-dropzone ...'
cp bower_components/angular-dropzone/lib/angular-dropzone.js public/js/angular-dropzone.js
cp bower_components/dropzone/downloads/dropzone.js public/js/dropzone.js
cp bower_components/dropzone/downloads/css/dropzone.css public/css/dropzone.css
echo 'OK'

echo -n '==> Deploying angular-bootstrap ...'
cp bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js public/js/ui-bootstrap-tpls.min.js
echo 'OK'

echo -n '==> Deploying angular-ngtable ...'
cp node_modules/ng-table/bundles/ng-table.min.js public/js/ng-table.min.js
cp node_modules/ng-table/bundles/ng-table.min.css public/css/ng-table.min.css
echo 'OK'

echo -n '==> Deploying jquery.datetimepicker ...'
cp bower_components/datetimepicker/build/jquery.datetimepicker.full.min.js public/js/jquery.datetimepicker.full.min.js
cp bower_components/datetimepicker/jquery.datetimepicker.css public/css/jquery.datetimepicker.css
echo 'OK'

echo -n '==> Deploying jquery-locationpicker-plugin ...'
cp bower_components/jquery-locationpicker-plugin/dist/locationpicker.jquery.min.js public/js/locationpicker.jquery.min.js
echo 'OK'

echo -n '==> Deploying custom JS ...'
cp assets/js/*.js public/js/
cp assets/js/controllers/*.js public/js/controllers/
echo 'OK'

echo -n '==> Deploying custom CSS ...'
lessc assets/css/main.less public/css/main.css
echo 'OK'

echo -n '==> Deploying Images ...'
cp assets/images/* public/images/ 2>>/dev/null
echo 'OK'

echo '=> Deploying Website Assets OK'
