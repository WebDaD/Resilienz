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
DB_HOST=$(json -f package.json config.host)
DB_USER=$(json -f package.json config.user)
DB_NAME=$(json -f package.json config.database)
DB_PWD=$(json -f package.json config.password)

echo '==> Creating Database Structure'
mysql -h $DB_HOST -u $DB_USER -p$DB_PWD $DB_NAME < scripts/database_structure.sql
echo '==> Creating Database Structure OK'

echo '==> Creating Database Data'
mysql -h $DB_HOST -u $DB_USER -p$DB_PWD $DB_NAME < scripts/database_data.sql
echo '==> Creating Database Data OK'

echo '=> Creating Database OK'
