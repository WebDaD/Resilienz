/**
 * @overview Login Lib
 * @module login
 * @author Dominik Sigmund
 * @version 0.1
 * @description Handles registering and login challenges
 * @memberof resilienz
 * @requires module:database
 * @requires fs
 * @requires nodemailer
 */
 var fs = require('fs')
 const nodemailer = require('nodemailer')
 function Login (database, language, bcrypt, saltfile, secret, mailconfig) {
   var self = {}
   self.saltRounds = 10
   self.secret = secret
   self.language = language
   self.database = database
   self.bcrypt = bcrypt
   self.saltfile = saltfile
   var saltfilecontent = fs.readFileSync(self.saltfile, 'utf8')
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
   self.transporter = nodemailer.createTransport(mailconfig)
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
         } else if (!user) {
           callback({msg: 'Wrong User or Password', status: 403})
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
 function reset (languageString, email, callback) {
   var self = this
   self.createToken(email, function (token) {
     var mailOptions = {
       from: '"Resilienz-App" <info@prixjeunesse.de>', // sender address
       to: email, // list of receivers
       subject: self.language.getString(languageString, 'reset_mail_subject'), // Subject line
       html: self.language.getString(languageString, 'reset_mail_text') + '<br/><a href="LINK/set-pwd?resetToken=' + token + '&email=' + email + '">' + self.language.getString(languageString, 'reset_mail_button') + '</a>' // html body
     }
     self.transporter.sendMail(mailOptions, function (error, info) {
       if (error) {
         callback(error)
       } else {
         callback(null, true)
       }
     })
   })
 }
 function setpwd (email, password, resetToken, callback) {
   var self = this
   self.checkToken(email, resetToken, function (error, result) {
     if (error) {
       callback(error)
     } else {
       if (result) {
         self.bcrypt.hash(password + self.secret, self.salt, function (err, hash) {
           if (err) {
             callback(err)
           } else {
             self.database.updatePassword(email, hash, function (error, user) {
               if (error) {
                 callback(error)
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
       } else {
         callback(null, false)
       }
     }
   })
 }
 function register (dataset, callback) {
   var self = this
   self.bcrypt.hash(dataset.register_password + self.secret, self.salt, function (err, hash) {
     if (err) {
       callback(err)
     } else {
       dataset.password = hash
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
     if ((!req.headers.email && !req.cookies['resilienzManager-email']) || (!req.headers.token && !req.cookies['resilienzManager-token'])) {
       res.status(403).send({msg: 'Not Logged In'})
     } else {
       var email = req.headers.email || req.cookies['resilienzManager-email']
       var token = req.headers.token || req.cookies['resilienzManager-token']
       self.checkToken(email, token, function (err, result) {
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
     var email = req.headers.email || req.cookies['resilienzManager-email']
     self.database.getUser(email, function (err, user) {
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
