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
 function Login (database, bcrypt, saltfile, secret) {
   var self = {}
   self.saltRounds = 10
   self.secret = secret
   self.database = database
   self.bcrypt = bcrypt
   self.saltfile = saltfile
   var saltfilecontent = fs.readFileSync(self.saltfile)
   if (!saltfilecontent) {
     self.salt = self.bcrypt.genSaltSync(self.saltRounds)
     fs.writeFileSync(self.saltfile, self.salt)
   } else {
     self.salt = saltfilecontent
   }
   self.login = login
   self.reset = reset
   self.setpwd = setpwd
   self.register = register
   self.checkToken = checkToken
   self.createToken = createToken
   self.isLoggedIn = isLoggedIn
   self.isAdmin = isAdmin
   return self
 }
 function login (email, pwd, callback) {
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
 function createToken (email, callback) {
   var self = this
   self.bcrypt.hash(email + self.secret, self.salt, callback) // err, hash
 }
 function checkToken (email, token, callback) {
   var self = this
   self.bcrypt.compare(email + self.secret, token, callback) // err, result(true, false)
 }
 function reset (email, callback) {
   // TODO: send Email with resetToken (normal token) and email-Adress
 }
 function setpwd (email, password, resetToken, callback) {
   // TODO: check Token, then update password for user, return same as register/login
 }
 function register (dataset, callback) {
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
 function isLoggedIn () {
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
 function isAdmin () { // only usable after .isLoggedIn
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
