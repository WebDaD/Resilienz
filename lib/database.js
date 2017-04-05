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
  return self
}

Database.prototype.getUsers = function (callback) {
  var self = this
  self.connection.query('SELECT vorname, nachname, email, active, language, location FROM userList', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}
Database.prototype.actionFinalize = function (id, callback) {
  var self = this
  self.connection.query('UPDATE actions SET finalized=1 WHERE id=' + id, function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}

Database.prototype.getActions = function (callback) {
  var self = this
  self.connection.query('SELECT email, language, location, start_time, end_time, finalized FROM actionList', function (error, results, fields) {
    if (error) {
      callback(error)
    } else {
      callback(null, results)
    }
  })
}

Database.prototype.getTranslations = function (callback) {
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
      callback(null, translations)
    }
  })
}

Database.prototype.getLayoutInfo = function (actionid, page, callback) { // return array of information.{width, height, x, y, imagefile, layoutfile}
  var self = this
  self.connection.query('SELECT 1', function (error, results, fields) { // TODO Write SQL Query for getLayoutInfo
    if (error) {
      callback(error)
    } else {
      var arr = []
      for (var i = 0; i < results.length; i++) {
        var info = {}
        info.width = results[i][0]
      // TODO add rest of cols to array
        arr.push(info)
      }
      callback(null, arr)
    }
  })
}
Database.prototype.close = function (callback) {
  this.connection.destroy()
  callback()
}
module.exports = Database
