#!/bin/bash
echo '=> Preparing to create Database'
if ! type "mysql" > /dev/null; then
  echo '==> mysql-client not installed, installing'
  apt-get install mysql-client
fi
if ! type "json" > /dev/null; then
  echo '==> json not installed, installing'
  npm install -g json
fi
echo '=> Preparation Done.'

echo '=> Creating Database'
DB_HOST=$(json -f config.json database.host | sed -e 's/\n//g')
DB_USER=$(json -f config.json database.user | sed -e 's/\n//g' )
DB_NAME=$(json -f config.json database.database | sed -e 's/\n//g')
DB_PWD=$(json -f config.json database.password | sed -e 's/\n//g')

mysql -h $DB_HOST -u root -p -e 'CREATE SCHEMA `$DB_NAME`;CREATE USER `$DB_USER`;GRANT ALL PRIVILEGES ON `$DB_NAME`.* TO "$DB_USER"@"%" IDENTIFIED BY "$DB_PWD"'


echo '==> Creating Database Structure'
mysql -h $DB_HOST -u $DB_USER -p$DB_PWD $DB_NAME < scripts/sql/structure.sql
echo '==> Creating Database Structure OK'

echo '==> Creating Database Data'
mysql -h $DB_HOST -u $DB_USER -p$DB_PWD $DB_NAME < scripts/sql/data.sql
echo '==> Creating Database Data OK'

echo '=> Creating Database OK'

echo '=> Creating Folders'

echo -n '==> Creating Folder Images...'
FOLDER=$(json -f config.json images | sed -e 's/\n//g')
mkdir -p $FOLDER
chmod 777 -R $FOLDER
echo 'OK'

echo -n '==> Creating Folder Books...'
FOLDER=$(json -f config.json books | sed -e 's/\n//g')
mkdir -p $FOLDER
chmod 777 -R $FOLDER
echo 'OK'

echo -n '==> Creating Folder Pages...'
FOLDER=$(json -f config.json pages | sed -e 's/\n//g')
mkdir -p $FOLDER
chmod 777 -R $FOLDER
echo 'OK'

echo -n '==> Creating Folder PDFs...'
FOLDER=$(json -f config.json pdfs | sed -e 's/\n//g')
mkdir -p $FOLDER
chmod 777 -R $FOLDER
echo 'OK'

echo -n '==> Creating Salt-File...'
FILE=$(json -f config.json salt | sed -e 's/\n//g')
touch $FILE
chmod 777 $FILE
echo 'OK'
echo '=> Creating Folders OK'
