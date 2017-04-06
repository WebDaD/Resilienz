#!/bin/bash
function checkFolder {
  PARM=$(json -f package.json config."$1" | sed -e 's/\n//g')
  if [ -d "$PARM" && -w "$PARM" ]
    then
      echo '===> $PARM exists and is writable'
    else
      echo '===> $PARM does not exist or is not writable'
      exit 1
  fi
}
function checkIfMySQLTableExists {
    table=$1;
    DB_HOST=$(json -f package.json config.database.host | sed -e 's/\n//g')
    DB_USER=$(json -f package.json config.database.user | sed -e 's/\n//g' )
    DB_NAME=$(json -f package.json config.database.database | sed -e 's/\n//g')
    DB_PWD=$(json -f package.json config.database.password | sed -e 's/\n//g')
    if [ $(mysql -N -s --host=$DB_HOST --user=$DB_USER --password=$DB_PWD -e \
        "select count(*) from information_schema.tables where \
            table_schema='${DB_NAME}' and table_name='${table}';") -eq 1 ]; then
        echo "===> Table ${table} exists! ...";
    else
        echo "===> Table ${table} does not exist! ..."
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
DB_HOST=$(json -f package.json config.database.host | sed -e 's/\n//g')
DB_USER=$(json -f package.json config.database.user | sed -e 's/\n//g' )
DB_NAME=$(json -f package.json config.database.database | sed -e 's/\n//g')
DB_PWD=$(json -f package.json config.database.password | sed -e 's/\n//g')

RESULT=`mysqlshow --host=$DB_HOST --user=$DB_USER --password=$DB_PWD $DB_NAME| grep -v Wildcard | grep -o $DB_NAME`
if [ "$RESULT" == "$DB_NAME" ]
  then
    echo '===> Database reachable'
  else
    echo '===> Cannot reach Database'
    exit 1
fi

checkIfMySQLTableExists "actions"
checkIfMySQLTableExists "actions_has_layouts"
checkIfMySQLTableExists "categories"
checkIfMySQLTableExists "categories_has_layouts"
checkIfMySQLTableExists "images"
checkIfMySQLTableExists "images_has_actions_has_layouts"
checkIfMySQLTableExists "languages"
checkIfMySQLTableExists "layout_has_language"
checkIfMySQLTableExists "layouts"
checkIfMySQLTableExists "positions"
checkIfMySQLTableExists "strings"
checkIfMySQLTableExists "translations"
checkIfMySQLTableExists "user"
echo '==> Verifying Database OK'

echo '==> Verifying Folders on Server'
checkFolder 'images'
checkFolder 'books'
checkFolder 'pages'
checkFolder 'pdfs'
SALT=$(json -f package.json config.salt | sed -e 's/\n//g')
if [ -e "$SALT" && -w "$SALT" ]
  then
    echo '===> $SALT exists and is writable'
  else
    echo '===> $SALT does not exist or is not writable'
    exit 1
fi
echo '==> Verifying Folders OK'

echo '==> Verifying File-Integrity'

echo -n '==> Verifying Server Files ...'
test -e app.js
test -e routes/backend.js
test -e routes/frontend.js
test -e routes/index.js
test -e routes/login.js
test -e lib/login.js
test -e lib/book-generator.js
test -e lib/database.js
test -e lib/language.js
test -e lib/layouter.js
echo 'OK'

echo -n '==> Verifying Templates ...'
test -e templates/container/actions.pug
test -e templates/container/fnish.pug
test -e templates/container/layouter.pug
test -e templates/container/users.pug
test -e templates/container/welcome.pug
test -e templates/includes/footer.pug
test -e templates/includes/head-debug.pug
test -e templates/includes/head.pug
test -e templates/includes/scripts-debug.pug
test -e templates/includes/scripts.pug
test -e templates/modals/editor.pug
test -e templates/pages/app.pug
test -e templates/pages/index.pug
test -e templates/pages/datenschutz.pug
test -e templates/pages/impressum.pug
test -e templates/pages/login.pug
test -e templates/pages/register.pug
test -e templates/pages/reset_pwd.pug
echo 'OK'

echo -n '==> Verifying CSS ...'
test -e public/css/bootstrap.min.css
test -e public/css/font-awesome.min.css
test -e public/css/ng-table.min.css
test -e public/css/main.css
test -e public/css/css.min.css
echo 'OK'

echo -n '==> Verifying JS ...'
test -e public/js/jquery.min.js
test -e public/js/jquery.cookie.js
test -e public/js/angular.min.js
test -e public/js/angular-route.min.js
test -e public/js/angular-resource.min.js
test -e public/js/angular-cookies.min.js
test -e public/js/ui-bootstrap-tpls.min.js
test -e public/js/ng-table.min.js
test -e public/js/resilienzManager.js
test -e public/js/resilienzManager-svc.js
test -e public/js/resilienzManager-dir.js
test -e public/js/controllers/actions-controller.js
test -e public/js/controllers/finalize-controller.js
test -e public/js/controllers/layouter-controller.js
test -e public/js/controllers/users-controller.js
test -e public/js/controllers/welcome-controller.js
test -e public/js/js.min.js
test -e public/js/login.js
echo 'OK'

echo -n '==> Verifying Images ...'
test -e public/images/android-chrome-144x144.png
test -e public/images/android-chrome-192x192.png
test -e public/images/android-chrome-256x256.png
test -e public/images/android-chrome-36x36.png
test -e public/images/android-chrome-384x384.png
test -e public/images/android-chrome-48x48.png
test -e public/images/android-chrome-512x512.png
test -e public/images/android-chrome-72x72.png
test -e public/images/android-chrome-96x96.png
test -e public/images/apple-touch-icon-114x114-precomposed.png
test -e public/images/apple-touch-icon-114x114.png
test -e public/images/apple-touch-icon-120x120-precomposed.png
test -e public/images/apple-touch-icon-120x120.png
test -e public/images/apple-touch-icon-144x144-precomposed.png
test -e public/images/apple-touch-icon-144x144.png
test -e public/images/apple-touch-icon-152x152-precomposed.png
test -e public/images/apple-touch-icon-152x152.png
test -e public/images/apple-touch-icon-180x180-precomposed.png
test -e public/images/apple-touch-icon-180x180.png
test -e public/images/apple-touch-icon-57x57-precomposed.png
test -e public/images/apple-touch-icon-57x57.png
test -e public/images/apple-touch-icon-60x60-precomposed.png
test -e public/images/apple-touch-icon-60x60.png
test -e public/images/apple-touch-icon-72x72-precomposed.png
test -e public/images/apple-touch-icon-72x72.png
test -e public/images/apple-touch-icon-76x76-precomposed.png
test -e public/images/apple-touch-icon-76x76.png
test -e public/images/apple-touch-icon-precomposed.png
test -e public/images/apple-touch-icon.png
test -e public/images/browserconfig.xml
test -e public/images/favicon-16x16.png
test -e public/images/favicon-194x194.png
test -e public/images/favicon-32x32.png
test -e public/images/favicon.ico
test -e public/images/loader.gif
test -e public/images/manifest.json
test -e public/images/mstile-144x144.png
test -e public/images/mstile-150x150.png
test -e public/images/mstile-310x150.png
test -e public/images/mstile-310x310.png
test -e public/images/mstile-70x70.png
test -e public/images/safari-pinned-tab.svg
echo 'OK'

echo '==> Verifying File-Integrity OK'

echo '==> Verifying Binaries'
if ! type "convert" > /dev/null
  then
    echo '==> imagemagick not installed, installing'
    apt-get install imagemagick
  else
    echo '===> imagemagick is installed'
fi
echo '==> Verifying Binaries OK'

echo '==> Verifying Server'
PORT=$(json -f package.json config.port | sed -e 's/\n//g')
if [ netstat -lnt | awk '$6 == "LISTEN" && $4 ~ ".$PORT"' ]
  then
    echo '===> Port is in use!'
    exit 1
  else
    echo '===> Can Use Port'
fi
echo '==> Verifying Server OK'

echo '=> Check-Done'
