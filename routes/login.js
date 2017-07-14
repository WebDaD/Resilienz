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
module.exports = function (app, language, login, config) {
  app.get('/login', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'], function (translations) {
      res.render('pages/login', {lang: translations, captcha: config.gcaptchaclient})
    })
  })
  app.get('/reset', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'], function (translations) {
      res.render('pages/reset_pwd', {lang: translations, captcha: config.gcaptchaclient})
    })
  })
  app.get('/set-pwd', function (req, res) {
    if (!req.query.resetToken || !req.query.email) {
      res.status(403).send('No ResetToken or E-Mail-Address given.')
    } else {
      language.listTranslation(req.cookies['resilienzManager-language'], function (translations) {
        res.render('pages/set_pwd', {lang: translations, captcha: config.gcaptchaclient, resetToken: req.query.resetToken, email: req.query.email})
      })
    }
  })
  app.get('/register', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'], function (translations) {
      language.listLanguages(function (languages) {
        res.render('pages/register', {lang: translations, languages: languages, captcha: config.gcaptchaclient})
      })
    })
  })
  app.post('/login', function (req, res) {
    if (req.body['captchaResponse'] === undefined || req.body['captchaResponse'] === '' || req.body['captchaResponse'] === null) {
      return res.status(403).json({msg: 'Please select captcha'})
    } else {
      var verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + config.gcaptchasecret + '&response=' + req.body['captchaResponse'] + '&remoteip=' + req.connection.remoteAddress.replace(/^.*:/, '')
      request(verificationUrl, function (error, response, body) {
        if (error) {
          return res.status(403).json(error)
        } else {
          body = JSON.parse(body)
          if (body.success !== undefined && !body.success) {
            return res.status(403).json({msg: 'Failed captcha verification'})
          } else {
            login.login(req.body.email, req.body.password, function (error, data) {
              if (error) {
                return res.status(403).json(error)
              } else {
                return res.status(200).json(data)
              }
            })
          }
        }
      })
    }
  })
  app.post('/reset', function (req, res) {
    if (req.body['captchaResponse'] === undefined || req.body['captchaResponse'] === '' || req.body['captchaResponse'] === null) {
      return res.status(403).json({msg: 'Please select captcha'})
    } else {
      var verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + config.gcaptchasecret + '&response=' + req.body['captchaResponse'] + '&remoteip=' + req.connection.remoteAddress.replace(/^.*:/, '')
      request(verificationUrl, function (error, response, body) {
        if (error) {
          return res.status(501).json(error)
        } else {
          body = JSON.parse(body)
          if (body.success !== undefined && !body.success) {
            return res.status(403).json({msg: 'Failed captcha verification'})
          } else {
            login.reset(req.body.email, function (error, data) {
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
  app.post('/set-pwd', function (req, res) {
    if (req.body['captchaResponse'] === undefined || req.body['captchaResponse'] === '' || req.body['captchaResponse'] === null) {
      return res.status(403).json({msg: 'Please select captcha'})
    } else {
      var verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + config.gcaptchasecret + '&response=' + req.body['captchaResponse'] + '&remoteip=' + req.connection.remoteAddress.replace(/^.*:/, '')
      request(verificationUrl, function (error, response, body) {
        if (error) {
          return res.status(501).json(error)
        } else {
          body = JSON.parse(body)
          if (body.success !== undefined && !body.success) {
            return res.status(403).json({msg: 'Failed captcha verification'})
          } else {
            login.setpwd(req.body.email, req.body.password, req.body.resetToken, function (error, data) {
              if (error) {
                return res.status(501).json(error)
              } else {
                if (!data) {
                  return res.status(403).json({msg: 'Wrong Token'})
                } else {
                  return res.status(200).json(data)
                }
              }
            })
          }
        }
      })
    }
  })
  app.post('/register', function (req, res) {
    if (req.body['captchaResponse'] === undefined || req.body['captchaResponse'] === '' || req.body['captchaResponse'] === null) {
      return res.status(403).json({msg: 'Please select captcha'})
    } else {
      var verificationUrl = 'https://www.google.com/recaptcha/api/siteverify?secret=' + config.gcaptchasecret + '&response=' + req.body['captchaResponse'] + '&remoteip=' + req.connection.remoteAddress.replace(/^.*:/, '')
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
