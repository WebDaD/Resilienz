# check if needed binaries are there, else notify and output install command
  # bower
  # mkdir
  # rm
  # cp
  # lessc
  
echo '=> Deploying Website Assets'

echo -n '==> Preparing Folders ...'
mkdir -p public
mkdir -p tmp
rm -rf public/*
rm -rf tmp/*
mkdir -p public/templates
mkdir -p public/css
mkdir -p public/js
mkdir -p public/js/controllers
mkdir -p public/images
mkdir -p public/fonts
echo 'OK'

echo -n '==> Getting Bower Componentes'
bower install --allow-root
echo 'OK'

echo -n '==> Deploying jquery ...'
cp bower_components/jquery/dist/jquery.min.js public/js/jquery.min.js
echo 'OK'

echo -n '==> Deploying Bootstrap ...'
cp bower_components/bootstrap/dist/css/bootstrap.min.css public/css/bootstrap.min.css
echo 'OK'

echo -n '==> Deploying Font-Awesome ...'
cp bower_components/font-awesome/css/font-awesome.min.css public/css/font-awesome.min.css
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

echo -n '==> Deploying angular-bootstrap ...'
cp bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js public/js/ui-bootstrap-tpls.min.js
echo 'OK'

echo -n '==> Deploying angular-ngtable ...'
cp bower_components/ng-table/ng-table.min.js public/js/ng-table.min.js
cp bower_components/ng-table/ng-table.min.css public/css/ng-table.min.css
echo 'OK'

echo -n '==> Deploying custom JS ...'
cp assets/js/*.js public/js/
cp assets/js/controllers/*.js public/js/controllers/
echo 'OK'

echo -n '==> Deploying custom CSS ...'
lessc assets/css/main.less public/css/main.css
lessc assets/css/login.less public/css/login.css
echo 'OK'

echo -n '==> Deploying Images ...'
cp assets/images/* public/images/ 2>>/dev/null
echo 'OK'

echo '=> Deploying Website Assets OK'
