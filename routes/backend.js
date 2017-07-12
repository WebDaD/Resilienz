/**
 * @overview Route Frontend File
 * @module index
 * @author Dominik Sigmund
 * @version 1.0
 * @description Exports frontend routes
 * @memberof resilienz
 * @requires module:fs
* @requires module:uuid
 */
var fs = require('fs')
const uuidV4 = require('uuid/v4')
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
  app.get('/powerpoint/:langkey', function (req, res) {
    var file = fs.createReadStream(config.powerpoints + '/' + req.params.langkey + '.ppt')
    var stat = fs.statSync(config.powerpoints + '/' + req.params.langkey + '.ppt')
    res.setHeader('Content-Length', stat.size)
    res.setHeader('Content-Type', 'application/vnd.ms-powerpoint')
    res.setHeader('Content-Disposition', 'attachment; filename=template_' + req.params.langkey + '.ppt')
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
  app.get('/actions/:id/:page/layout', login.isLoggedIn(), function (req, res) {
    database.getLayoutImagesByActionPage(req.params.id, req.params.page, function (error, result) {
      if (error) {
        res.status(501).json(error)
      } else {
        res.status(200).json(result)
      }
    })
  })
  app.put('/actions/:id/:page/layout', login.isLoggedIn(), function (req, res) {
    database.saveLayout(req.params.id, req.params.page, req.body.id, function (error, result) {
      if (error) {
        res.status(501).json(error)
      } else {
        res.status(200)
      }
    })
  })
  app.get('/book/:action_id/', login.isLoggedIn(), function (req, res) {
    bookGenerator.createBook(req.params.action_id, req.cookies['resilienzManager-language'], function (error, path) {
      if (error) {
        res.status(501).json(error)
      } else {
        var file = fs.createReadStream(path)
        var stat = fs.statSync(path)
        res.setHeader('Content-Length', stat.size)
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename=myBook.pdf')
        file.pipe(res)
      }
    })
  })
  app.get('/categories/full/', login.isLoggedIn(), function (req, res) {
    database.getCategoriesFull(function (error, categories) {
      if (error) {
        res.status(501).json(error)
      } else {
        res.status(200).json(categories)
      }
    })
  })
  app.get('/images/:name/', login.isLoggedIn(), function (req, res) {
    res.status(200).sendfile(config.images + '/' + req.params.name)
  })
  app.delete('/images/:name/', login.isLoggedIn(), function (req, res) {
    database.removeImage(req.params.name, function (error, name) {
      if (error) {
        res.status(501).json(error)
      } else {
        res.status(200).end()
      }
    })
  })
  app.put('/images/:name/rescale', login.isLoggedIn(), function (req, res) {
    layouter.rescaleImage(config.images + '/' + req.params.name, req.body.x1, req.body.y1, req.body.width, req.body.height, function (error) {
      if (error) {
        res.status(501).json(error)
      } else {
        res.status(200)
      }
    })
  })
  app.get('/images/:action_id/:page', login.isLoggedIn(), function (req, res) {
    layouter.createPage(req.params.action_id, req.cookies['resilienzManager-language'], req.params.page, function (error, result) {
      if (error) {
        res.status(501).json(error)
      } else {
        if (result) {
          res.status(501).end()
        } else {
          res.status(200).sendfile(config.pagespath + '/' + req.params.action_id + '/' + req.params.page + '_two.png')
        }
      }
    })
  })
  app.get('/images/:action_id/:page/:position_id', login.isLoggedIn(), function (req, res) {
    database.getImage(req.params.action_id, req.params.page, req.params.position_id, function (error, name) {
      if (error) {
        res.status(501).json(error)
      } else {
        res.status(200).sendfile(config.images + '/' + name)
      }
    })
  })
  app.post('/images/upload/:action_id/:page/:position_id', login.isLoggedIn(), function (req, res) {
    fs.readFile(req.files.displayImage.path, function (err, data) {
      if (err) {
        res.status(501).json(err)
      } else {
        var newFileName = uuidV4()
        fs.writeFile(config.images + '/' + newFileName, data, function (err) {
          if (err) {
            res.status(501).json(err)
          } else {
            database.addImage(req.params.action_id, req.params.page, req.params.position_id, newFileName, function (error) {
              if (error) {
                res.status(501).json(error)
              } else {
                res.status(200).end()
              }
            })
          }
        })
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
}
