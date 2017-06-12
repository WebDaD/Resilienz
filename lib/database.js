/**
 * @overview Database Lib
 * @module database
 * @author Dominik Sigmund
 * @version 0.1
 * @description Positions Images on Layouts
 * @memberof resilienz
 * @requires module:mysql
 */

function Database (config) {
  var self = {}
  self.config = config
  self.mysql = require('mysql')
  self.connection = self.mysql.createConnection(self.config)
  self.connection.connect()
  self.getUsers = getUsers
  self.getUser = getUser
  self.addUser = addUser
  self.actionFinalize = actionFinalize
  self.getActions = getActions
  self.getLanguages = getLanguages
  self.getTranslations = getTranslations
  self.getLayoutInfo = getLayoutInfo
  self.close = close
  return self
}

function getUsers (callback) {
  var self = this
  self.connection.query('SELECT vorname, nachname, email, language, location FROM userList', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}
function getUser (email, callback) {
  var self = this
  self.connection.query('SELECT id, email, language, action_id, admin FROM userList WHERE email="' + email + '" LIMIT 1', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results[0])
    }
  })
}
function addUser (data, callback) {
  var self = this
  // TODO: add to database (actions and user)
  /*self.connection.query('SELECT id, email, language, action_id, admin FROM userList WHERE email="' + email + '" LIMIT 1', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results[0])
    }
  })*/
}
function actionFinalize (id, callback) {
  var self = this
  self.connection.query('UPDATE actions SET finalized=1 WHERE id=' + id, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}

function getActions (callback) {
  var self = this
  self.connection.query('SELECT email, language, location, start_time, end_time, finalized FROM actionList', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}
function getLanguages (callback) {
  var self = this
  self.connection.query('SELECT lang_key AS key, name FROM languages', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}
function getTranslations (callback) {
  var self = this
  self.connection.query('SELECT language_key, string_key, translation FROM resilienz.language_translations ORDER BY language_key ASC, string_key ASC', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      var translations = {}
      for (var i = 0; i < results.length; i++) {
        if (!translations[results[i][0]]) {
          translations[results[i][0]] = {}
        }
        translations[results[i][0]][results[i][1]] = results[i][2]
      }
      console.log(translations)
      callback(null, translations)
    }
  })
}

function getLayoutInfo (actionid, page, callback) { // return array of information.{width, height, x, y, imagefile, layoutfile}
  var self = this
  self.connection.query('SELECT 1', function (error, results, fields) { // TODO Write SQL Query for getLayoutInfo
    if (error) {
      callback(error)
    } else {
      var arr = []
      for (var i = 0; i < results.length; i++) {
        var info = {}
        info.width = results[i][0]
      // TODO add rest of cols to array. if no image, doesnt matter
        arr.push(info)
      }
      callback(null, arr)
    }
  })
}
function close (callback) {
  this.connection.destroy()
  callback()
}
module.exports = Database
