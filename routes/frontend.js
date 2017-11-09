/**
 * @overview Route Frontend File
 * @module index
 * @author Dominik Sigmund
 * @version 1.0
 * @description Exports frontend routes
 * @memberof resilienz
 */

 /** Exports Routes
 * @param {object} app - Express app
 * @param {object} language - language Object
 * @param {object} login - login Object
 */
module.exports = function (app, language, login) {
  app.get('/container/welcome', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'] || 'de', function (translations) {
      res.render('container/welcome', {lang: translations})
    })
  })
  app.get('/container/materials', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'] || 'de', function (translations) {
      res.render('container/materials', {lang: translations})
    })
  })
  app.get('/container/finish', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'] || 'de', function (translations) {
      res.render('container/finish', {lang: translations})
    })
  })
  app.get('/container/layouter', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'] || 'de', function (translations) {
      res.render('container/layouter', {lang: translations})
    })
  })
  app.get('/modals/editor', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'] || 'de', function (translations) {
      res.render('modals/editor', {lang: translations})
    })
  })
  app.get('/modals/instructions', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'] || 'de', function (translations) {
      res.render('modals/instructions', {lang: translations})
    })
  })
  app.get('/', function (req, res) { // index
    language.listTranslation(req.cookies['resilienzManager-language'] || 'de', function (translations) {
      res.render('pages/index', {lang: translations})
    })
  })
  app.get('/intro', function (req, res) { // intro-page (links to login/register)
    language.listTranslation(req.cookies['resilienzManager-language'] || 'de', function (translations) {
      res.render('pages/intro', {lang: translations})
    })
  })
  app.get('/english', function (req, res) { // intro-page (links to login/register)
    language.listTranslation('en', function (translations) {
      res.render('pages/intro', {lang: translations})
    })
  })
  app.get('/espagnol', function (req, res) { // intro-page (links to login/register)
    language.listTranslation('es', function (translations) {
      res.render('pages/intro', {lang: translations})
    })
  })
  app.get('/app', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'] || 'de', function (translations) {
      res.render('pages/app', {lang: translations})
    })
  })
  app.get('/datenschutz', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'] || 'de', function (translations) {
      if (req.cookies['resilienzManager-language'] === 'en') {
        res.render('pages/data_protection', {lang: translations})
      } else if (req.cookies['resilienzManager-language'] === 'es') {
        res.render('pages/politica_de_privacidad', {lang: translations})
      } else {
        res.render('pages/datenschutz', {lang: translations})
      }
    })
  })
  app.get('/impressum', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'] || 'de', function (translations) {
      if (req.cookies['resilienzManager-language'] === 'en') {
        res.render('pages/site_notice', {lang: translations})
      } else if (req.cookies['resilienzManager-language'] === 'es') {
        res.render('pages/aviso_legal', {lang: translations})
      } else {
        res.render('pages/impressum', {lang: translations})
      }
    })
  })
  app.get('/nutzungsbedingungen', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'] || 'de', function (translations) {
      if (req.cookies['resilienzManager-language'] === 'en') {
        res.render('pages/usage_contract', {lang: translations})
      } else if (req.cookies['resilienzManager-language'] === 'es') {
        res.render('pages/contrato_de_uso', {lang: translations})
      } else {
        res.render('pages/nutzungsbedingungen', {lang: translations})
      }
    })
  })
  // ADMIN ONLY
  app.get('/container/users', login.isLoggedIn(), login.isAdmin(), function (req, res) {
    res.render('container/users')
  })
  app.get('/container/actions', login.isLoggedIn(), login.isAdmin(), function (req, res) {
    res.render('container/actions')
  })
}
