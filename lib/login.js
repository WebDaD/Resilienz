/**
 * @overview Login Lib
 * @module login
 * @author Dominik Sigmund
 * @version 0.1
 * @description Handles registering and login challenges
 * @memberof resilienz
* @requires module:database
 */
 function Login (database) {
   var self = {}
   self.database = database
   return self
 }

 Login.prototype.register = function (dataset, callback) {
   var self = this
   // TODO encrypt pwd, write data into database, return admin,id,action,login,token, email, status 200
 }
 Login.prototype.isLoggedIn = function () {
   return function (req, res, next) {
     // info from header
   }
 }
 Login.prototype.isAdmin = function () {
   return function (req, res, next) {
     // info from header
   }
 }
 module.exports = Login
