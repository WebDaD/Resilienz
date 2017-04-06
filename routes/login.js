/**
 * @overview Route Login File
 * @module index
 * @author Dominik Sigmund
 * @version 1.0
 * @description Exports login routes
 * @memberof resilienz
 * @requires request
 */
var request = require('request')
 /** Exports Routes
 * @param {object} app - Express app
 * @param {object} language - language Object
 * @param {object} login - login Object
 */
module.exports = function (app, language, login) {
  app.get('/login', function (req, res) {
    language.listTranslation(req.cookies.lang, function (translations) {
      res.render('pages/login', {lang: translations})
    })
  })
  app.get('/register', function (req, res) {
    language.listTranslation(req.cookies.lang, function (translations) {
      language.listLanguages(function (languages) {
        res.render('pages/register', {lang: translations, languages: languages})
      })
    })
  })
  app.post('/login', function (req, res) {
    var secretKey = '6Lf14CgTAAAAALwtDdvvb3_k0QjxRq4QmnIoIDp4'
    if (req.body['captchaResponse'] === undefined || req.body['captchaResponse'] === '' || req.body['captchaResponse'] === null) {
      return res.status(403).json({msg: 'Please select captcha'})
    } else {
      var verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey + '&response=' + req.body['g-recaptcha-response'] + '&remoteip=' + req.connection.remoteAddress
      request(verificationUrl, function (error, response, body) {
        if (error) {
          return res.status(501).json(error)
        } else {
          body = JSON.parse(body)
          if (body.success !== undefined && !body.success) {
            return res.status(403).json({msg: 'Failed captcha verification'})
          } else {
            login.login(req.body.email, req.body.password, function (error, data) {
              if (error) {
                return res.status(501).json(error)
              } else {
                return res.status(200).json(data)
              }
            })
          }
        }
      })
    }
  })
  app.post('/register', function (req, res) {
    var secretKey = '6Lf14CgTAAAAALwtDdvvb3_k0QjxRq4QmnIoIDp4'
    if (req.body['captchaResponse'] === undefined || req.body['captchaResponse'] === '' || req.body['captchaResponse'] === null) {
      return res.status(403).json({msg: 'Please select captcha'})
    } else {
      var verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + secretKey + '&response=' + req.body['g-recaptcha-response'] + '&remoteip=' + req.connection.remoteAddress
      request(verificationUrl, function (error, response, body) {
        if (error) {
          return res.status(501).json(error)
        } else {
          body = JSON.parse(body)
          if (body.success !== undefined && !body.success) {
            return res.status(403).json({msg: 'Failed captcha verification'})
          } else {
            login.register(req.body, function (error, data) {
              if (error) {
                return res.status(501).json(error)
              } else {
                return res.status(200).json(data)
              }
            })
          }
        }
      })
    }
  })
}
