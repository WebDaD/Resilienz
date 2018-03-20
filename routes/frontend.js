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
    var domain = req.headers.host.split('.')[1].trim()
    if (domain === 'de') {
      language.listTranslation(req.cookies['resilienzManager-language'] || 'de', function (translations) {
        res.render('pages/index_de', {lang: translations})
      })
    } else {
      language.listTranslation(req.cookies['resilienzManager-language'] || 'en', function (translations) {
        res.render('pages/index_en', {lang: translations})
      })
    }
  })
  app.get('/intro', function (req, res) { // intro-page (links to login/register)
    language.listTranslation(req.cookies['resilienzManager-language'] || 'de', function (translations) {
      res.render('pages/intro', {lang: translations})
    })
  })
  app.get('/deutsch', function (req, res) { // intro-page (links to login/register)
    language.listTranslation('de', function (translations) {
      res.render('pages/index_single_de', {lang: translations})
    })
  })
  app.get('/english', function (req, res) { // intro-page (links to login/register)
    language.listTranslation('en', function (translations) {
      res.render('pages/index_single_en', {lang: translations})
    })
  })
  app.get('/espagnol', function (req, res) { // intro-page (links to login/register)
    language.listTranslation('es', function (translations) {
      res.render('pages/index_single_es', {lang: translations})
    })
  })
  app.get('/arab', function (req, res) { // intro-page (links to login/register)
    language.listTranslation('ar', function (translations) {
      res.render('pages/index_single_ar', {lang: translations})
    })
  })
  app.get('/intro_de', function (req, res) { // intro-page (links to login/register)
    language.listTranslation('de', function (translations) {
      res.render('pages/intro', {lang: translations})
    })
  })
  app.get('/intro_en', function (req, res) { // intro-page (links to login/register)
    language.listTranslation('en', function (translations) {
      res.render('pages/intro', {lang: translations})
    })
  })
  app.get('/intro_es', function (req, res) { // intro-page (links to login/register)
    language.listTranslation('es', function (translations) {
      res.render('pages/intro', {lang: translations})
    })
  })
  app.get('/intro_ar', function (req, res) { // intro-page (links to login/register)
    language.listTranslation('ar', function (translations) {
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
      } else if (req.cookies['resilienzManager-language'] === 'ar') {
        res.render('pages/usage_arab', {lang: translations})
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
