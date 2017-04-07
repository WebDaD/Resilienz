#!/bin/bash
if ! type "mysql" > /dev/null; then
  echo '==> mysql-client not installed, installing'
  apt-get install mysql-client
fi
DB_HOST=$(json -f config.json database.host | sed -e 's/\n//g')
DB_USER=$(json -f config.json database.user | sed -e 's/\n//g' )
DB_NAME=$(json -f config.json database.database | sed -e 's/\n//g')
DB_PWD=$(json -f config.json database.password | sed -e 's/\n//g')

mysql -h $DB_HOST -u $DB_USER -p$DB_PWD $DB_NAME < scripts/sql/export_translations.sql | sed 's/\t/,/g' > translations.csv
