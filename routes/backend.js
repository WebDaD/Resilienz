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
  app.get('/book/:action_id/', login.isLoggedIn(), function (req, res) {
    // TODO: create book -> languague, then servce as PDF
  })
  app.get('/categories/full/', login.isLoggedIn(), function (req, res) {
    // TODO: return cats ({id, sort: -1, name: '', pages: -1, layouts: []}) with allowed layouts and their positions and pages (show real pages eg 32, but only the left ones!)
  })
  app.get('/images/:id/', login.isLoggedIn(), function (req, res) {
    // TODO: return image (from database table image_on_positions)
  })
  app.put('/images/:id/rescale', login.isLoggedIn(), function (req, res) {
    // TODO:  <-- rescales image (from database table image_on_positions) (body: { x1:int, y1:int, x2: int, y2: int, width: int, height:int })
  })
  app.get('/images/:action_id/:categorie_id/:page', login.isLoggedIn(), function (req, res) {
    // TODO: return layout from database
  })
  app.get('/images/:action_id/:categorie_id/:page/:position_id', login.isLoggedIn(), function (req, res) {
    // TODO: return single image for action // TODO: remeber: pages have _two if not page 1 or 44 (not seen anyways)
  })
  app.post('/images/upload/:action_id/:categorie_id/:page/:position_id', login.isLoggedIn(), function (req, res) {
    // TODO: upload image https://howtonode.org/really-simple-file-uploads
    // TODO: copy to folder, write to database
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
}
