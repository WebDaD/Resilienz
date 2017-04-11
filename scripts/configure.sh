#!/bin/bash
if  ! type "json" > /dev/null ; then
  echo '==> json not installed, installing'
  npm install -g json
fi
if [ ! -e "config.json" ]; then
  cp config.json.sample config.json
fi
echo '=> Configuration...'
echo -n "Skip Configuration and use Default Values? (y|n) [n]: "
read -r -n 1 skip
echo ''
if [ "$skip" == "y" ]; then
  echo '=> Configuration Skipped'
  exit 0
fi
function textValue {
  PARM=$(json -f config.json "$1" | sed -e 's/\n//g')
  read -r -p "$2 [$PARM]: " newparm
  if [ -n "$newparm" ]
  then
    exeString="this.config."
    exeString+=$1
    exeString+="="
    exeString+=$newparm
    json -I -q -f package.json -e "$exeString"
    echo "$1 set to $newparm"
  else
    echo "$1 set to $PARM"
  fi
}
textValue port "Enter Port"
textValue database.host "Enter Database Server"
textValue database.database "Enter Database Name"
textValue database.user "Enter Database User"
textValue database.password "Enter Database Password"
textValue images "Enter Path for Images"
textValue books "Enter Path for Books"
textValue pages "Enter Path for Pages"
textValue pdfs "Enter Path for Manuals"
textValue backups "Enter Path for Backups"
textValue salt "Enter Path for Salt-File"
textValue bookpages "Enter Number of Pages in Book"
textValue serversecret "Enter Random stuff to add to passwords"
textValue gcaptchasecret "Enter Server Key for Google NoCaptcha"
textValue gcaptchaclient "Enter Site Key for Google NoCaptcha"
echo '=> Configuration Complete'
exit 0
