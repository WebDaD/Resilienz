#!/bin/bash
if  ! type "json" > /dev/null ; then
  echo '==> json not installed, installing'
  npm install -g json
fi
if ! type "mysqldump" > /dev/null; then
  echo '==> mysql-client not installed, installing'
  apt-get install mysql-client
fi
echo '=> Backing Up Data...'

D_BACKUPS=$(json -f config.json backups | sed -e 's/\n//g')
now=$(date +"%Y%m%d_%H%M%S")
db_sqlfile=resilienz_db.sql

mkdir ${D_BACKUPS}rbtmp

echo '==> Dumping Database...'
DB_HOST=$(json -f config.json database.host | sed -e 's/\n//g')
DB_USER=$(json -f config.json database.user | sed -e 's/\n//g' )
DB_NAME=$(json -f config.json database.database | sed -e 's/\n//g')
DB_PWD=$(json -f config.json database.password | sed -e 's/\n//g')

mysqldump -h $DB_HOST -u $DB_USER -p$DB_PWD --databases $DB_NAME > ${D_BACKUPS}rbtmp/$db_sqlfile

echo '==> Archiving Folders and SALT...'

F_IMAGES=$(json -f config.json images | sed -e 's/\n//g')
F_BOOKS=$(json -f config.json books | sed -e 's/\n//g')
F_PAGES=$(json -f config.json pages | sed -e 's/\n//g')
F_PDFS=$(json -f config.json pdfs | sed -e 's/\n//g')
FILE_SALT=$(json -f config.json salt | sed -e 's/\n//g')

cp -a $F_IMAGES ${D_BACKUPS}rbtmp/images
cp -a $F_BOOKS ${D_BACKUPS}rbtmp/books
cp -a $F_PAGES ${D_BACKUPS}rbtmp/pages
cp -a $F_PDFS ${D_BACKUPS}rbtmp/pdfs
cp $FILE_SALT ${D_BACKUPS}rbtmp/my.salt

cd  ${D_BACKUPS}rbtmp
tar -zcvf $D_BACKUPS$now-resilienz.tar.gz *

rm -rf ${D_BACKUPS}rbtmp

echo "=> Backup done, your file is $D_BACKUPS$now-resilienz.tar.gz"
