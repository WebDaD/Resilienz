/**
 * @overview Login Lib
 * @module login
 * @author Dominik Sigmund
 * @version 0.1
 * @description Handles registering and login challenges
 * @memberof resilienz
 * @requires module:database
 * @requires fs
 */
 var fs = require('fs')
 function Login (database, bcrypt, saltfile) {
   var self = {}
   self.saltRounds = 10
   self.secret = 'flOX8A6cZs5DwP62fgTR'
   self.database = database
   self.bcrypt = bcrypt
   self.saltfile = saltfile
   var saltfilecontent = fs.readFileSync(self.saltfile)
   if (!saltfilecontent.trim()) {
     self.salt = self.bcrypt.genSaltSync(self.saltRounds)
     fs.writeFileSync(self.saltfile, self.salt)
   } else {
     self.salt = saltfilecontent
   }
   return self
 }
 Login.prototype.login = function (email, pwd, callback) {
   var self = this
   self.bcrypt.hash(pwd + self.secret, self.salt, function (err, hash) {
     if (err) {
       callback(err)
     } else {
       self.database.getUser(email, function (err, user) {
         if (err) {
           callback(err)
         } else {
           if (user.password === hash) {
             var send = {}
             send.admin = user.admin
             send.id = user.id
             send.action = user.action_id
             send.email = user.email
             send.language = user.language
             self.createToken(user.email, function (err, token) {
               if (err) {
                 callback(err)
               } else {
                 send.token = token
                 callback(null, send)
               }
             })
           } else {
             callback({msg: 'Wrong User or Password', status: 403})
           }
         }
       })
     }
   })
 }
 Login.prototype.createToken = function (email, callback) {
   var self = this
   self.bcrypt.hash(email + self.secret, self.salt, callback) // err, hash
 }
 Login.prototype.checkToken = function (email, token, callback) {
   var self = this
   self.bcrypt.compare(email + self.secret, token, callback) // err, result(true, false)
 }
 Login.prototype.register = function (dataset, callback) {
   var self = this
   self.bcrypt.hash(dataset.password + self.secret, self.salt, function (err, hash) {
     if (err) {
       callback(err)
     } else {
       self.database.addUser(dataset, function (err, user) {
         if (err) {
           callback(err)
         } else {
           var send = {}
           send.admin = 0
           send.id = user.id
           send.action = user.action_id
           send.email = user.email
           send.language = user.language
           self.createToken(user.email, function (err, token) {
             if (err) {
               callback(err)
             } else {
               send.token = token
               callback(null, send)
             }
           })
         }
       })
     }
   })
 }
 Login.prototype.isLoggedIn = function () {
   var self = this
   return function (req, res, next) {
     if (!req.headers.email || !req.headers.token) {
       res.status(403).send({msg: 'Not Logged In'})
     } else {
       self.checkToken(req.headers.email, req.headers.token, function (err, result) {
         if (err) {
           res.status(501).send({msg: 'Error on Token-Check'})
         } else {
           if (result) {
             next()
           } else {
             res.status(403).send({msg: 'Wrong Login Information.'})
           }
         }
       })
     }
   }
 }
 Login.prototype.isAdmin = function () { // only usable after .isLoggedIn
   var self = this
   return function (req, res, next) {
     self.database.getUser(req.headers.email, function (err, user) {
       if (err) {
         res.status(403).send({msg: 'User not Logged In'})
       } else {
         if (user.admin === '1') {
           next()
         } else {
           res.status(403).send({msg: 'User not an Admin'})
         }
       }
     })
   }
 }
 module.exports = Login
