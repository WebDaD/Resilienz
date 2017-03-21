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

Database.prototype.getLayoutInfo = function (actionid, page, callback) { // return array of information.{width, height, x, y, imagefile, layoutfile}
  var self = this
  self.connection.query('SELECT 1', function (error, results, fields) { // TODO Qrite SQL Query
    if (error) {
      callback(error)
    } else {
      var arr = []
      for (var i = 0; i < results.length; i++) {
        var info = {}
        info.width = results[i][0]
      // TODO add rest of cols
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
