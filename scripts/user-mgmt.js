const mode = process.argv[1]

var config = require('../config.json')
var Database = require('../lib/database.js')

var database = new Database(config.database)

if (mode === 'delete') {
  var userID = process.argv[2]
  var actionID = process.argv[3]
  database.deleteUser(userID, actionID, function(status, error) {
    if (error) {
      console.error(error)
    } else {
      console.log(status)
    }
  })
} else { // list users
  database.getUsers(function(error, users) {
    if (error) {
      console.error(error)
    } else {
      console.log('-- users --')
      console.log('-----------')
      users.forEach(user => {
        console.log(user.id + ' - ' + user.action_id + ' : ' + user.vorname + ' ' + user.nachname + ' <' + user.email + '>')
      })
    }
  })
}