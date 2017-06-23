var config = require('./config.json')
var bcrypt = require('bcrypt')
var fs = require('fs')
var md5 = require('md5')
var readlineSync = require('readline-sync')
var Database = require('./lib/database.js')
var database = new Database(config.database)
var salt = ''
var saltfilecontent = fs.readFileSync(config.salt)
if (!saltfilecontent) {
  salt = bcrypt.genSaltSync(10)
  fs.writeFileSync(config.salt, salt)
} else {
  salt = saltfilecontent
}

console.log('Welcome to the User Creator for Resiliency!')
var data = {}
data.register_vorname = readlineSync.question('Enter Vorname: ')
data.register_nachname = readlineSync.question('Enter Nachname: ')
data.register_email = readlineSync.questionEMail('Enter E-Mail: ')
data.register_language = readlineSync.question('Enter LanguageCode [en]: ', {
  defaultInput: 'en'
})
data.password = readlineSync.question('Enter Password: ', {
  hideEchoBack: true
})
data.passwordRepeat = readlineSync.question('Repeat Password: ', {
  hideEchoBack: true
})
while (data.password !== data.passwordRepeat) {
  console.error('Passwords do not match, please try again (or STRG+C to exit)')
  data.passwordRepeat = readlineSync.question('Repeat Password: ', {
    hideEchoBack: true
  })
}
data.admin = 0
if (readlineSync.keyInYN('Is this an Admin-User? [yn] ')) {
  data.admin = 1
} else {
  data.register_location = readlineSync.question('Enter Location: ')
  data.register_start = readlineSync.question('Enter Start Time: ')
  data.register_stop = readlineSync.question('Enter Stop Time: ')
}
data.password = md5(data.password)
bcrypt.hash(data.password + config.secret, salt, function (error, hash) {
  if (error) {
    console.error(error)
    process.exit(1)
  } else {
    if (data.admin === '1') {
      database.addAdminUser(data, function (error, result) {
        if (error) {
          console.error(error)
          process.exit(1)
        } else {
          console.log('ADMIN User ' + data.email + ' added with ID ' + result.id)
          process.exit(0)
        }
      })
    } else {
      database.addUser(data, function (error, result) {
        if (error) {
          console.error(error)
          process.exit(1)
        } else {
          console.log('User ' + data.email + ' added with ID ' + result.id)
          process.exit(0)
        }
      })
    }
  }
})
