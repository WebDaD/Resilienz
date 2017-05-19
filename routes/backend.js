/**
 * @overview Route Frontend File
 * @module index
 * @author Dominik Sigmund
 * @version 1.0
 * @description Exports frontend routes
 * @memberof resilienz
 * @requires module:fs
 */
var fs = require('fs')
 /** Exports Routes
 * @param {object} app - Express app
 * @param {object} database - Database Object
 * @param {object} language - language Object
 * @param {object} login - login Object
 * @param {object} layouter - layouter Object
 * @param {object} bookGenerator - bookGenerator Object
 * @param {object} config - config Object
 */
module.exports = function (app, database, language, login, layouter, bookGenerator, config) {
  app.get('/pdf/:pdfname', function (req, res) {
    var file = fs.createReadStream(config.pdfs + req.params.pdfname + '.pdf')
    var stat = fs.statSync(config.pdfs + req.params.pdfname + '.pdf')
    res.setHeader('Content-Length', stat.size)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=' + req.params.pdfname + '.pdf')
    file.pipe(res)
  })
  app.put('/actions/:id/finalize', login.isLoggedIn(), function (req, res) {
    database.actionFinalize(req.params.id, function (error, result) {
      if (error) {
        res.status(501).json(error)
      } else {
        res.status(200)
      }
    })
  })
  // ADMIN ONLY
  app.get('/users', login.isLoggedIn(), login.isAdmin(), function (req, res) {
    database.getUsers(function (error, users) {
      if (error) {
        res.status(501).json(error)
      } else {
        res.json(users)
      }
    })
  })
  app.get('/actions', login.isLoggedIn(), login.isAdmin(), function (req, res) {
    database.getActions(function (error, actions) {
      if (error) {
        res.status(501).json(error)
      } else {
        res.json(actions)
      }
    })
  })
  // TODO: app.get '/images/action/categorie_id/pagenr' <-- return layout for action
  // TODO: app.get '/images/action/categorie_id/pagenr/positionid' <-- return single image for action
}
