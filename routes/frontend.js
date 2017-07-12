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
    language.listTranslation(req.cookies['resilienzManager-language'], function (translations) {
      res.render('container/welcome', {lang: translations})
    })
  })
  app.get('/container/finish', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'], function (translations) {
      res.render('container/finish', {lang: translations})
    })
  })
  app.get('/container/layouter', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'], function (translations) {
      res.render('container/layouter', {lang: translations})
    })
  })
  app.get('/modal/editor', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'], function (translations) {
      res.render('modals/editor', {lang: translations})
    })
  })
  app.get('/', function (req, res) { // index
    language.listTranslation(req.cookies['resilienzManager-language'] || 'en', function (translations) {
      res.render('pages/index', {lang: translations})
    })
  })
  app.get('/intro', function (req, res) { // intro-page (links to login/register)
    language.listTranslation(req.cookies['resilienzManager-language'] || 'en', function (translations) {
      res.render('pages/intro', {lang: translations})
    })
  })
  app.get('/app', login.isLoggedIn(), function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'] || 'en', function (translations) {
      res.render('pages/app', {lang: translations})
    })
  })
  app.get('/datenschutz', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'] || 'en', function (translations) {
      res.render('pages/datenschutz', {lang: translations})
    })
  })
  app.get('/impressum', function (req, res) {
    language.listTranslation(req.cookies['resilienzManager-language'] || 'en', function (translations) {
      res.render('pages/impressum', {lang: translations})
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
