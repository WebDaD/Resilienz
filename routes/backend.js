/**
 * @overview Route Frontend File
 * @module index
 * @author Dominik Sigmund
 * @version 1.0
 * @description Exports frontend routes
 * @memberof resilienz
 * @requires module:fs
  * @requires module:mime-types
* @requires module:uuid
 */
var fs = require('fs')
var mime = require('mime-types')
var multer = require('multer')
var upload = multer({ dest: '/tmp/' })
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
    var file = config.pdfs + '/' + req.params.pdfname + '.pdf'
    fs.access(file, fs.constants.R_OK, function (error) {
      if (error) {
        console.error(error)
        res.status(404).end()
      } else {
        var filestream = fs.createReadStream(file)
        var stat = fs.statSync(file)
        res.setHeader('Content-Length', stat.size)
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader('Content-Disposition', 'attachment; filename=' + req.params.pdfname + '.pdf')
        filestream.pipe(res)
      }
    })
  })
  app.get('/downloads/:lang/:name', function (req, res) {
    var file = config.downloads + '/' + req.params.lang + '/' + req.params.name
    fs.access(file, fs.constants.R_OK, function (error) {
      if (error) {
        console.error(error)
        res.status(404).end()
      } else {
        var filestream = fs.createReadStream(file)
        var stat = fs.statSync(file)
        res.setHeader('Content-Length', stat.size)
        res.setHeader('Content-Type', mime.lookup(req.params.name) || 'application/octet-stream')
        res.setHeader('Content-Disposition', 'attachment; filename=' + req.params.name)
        filestream.pipe(res)
      }
    })
  })
  app.get('/powerpoint/:langkey', function (req, res) {
    var file = config.powerpoints + '/' + req.params.langkey + '.ppt'
    fs.access(file, fs.constants.R_OK, function (error) {
      if (error) {
        console.error(error)
        res.status(404).end()
      } else {
        var filestream = fs.createReadStream(file)
        var stat = fs.statSync(file)
        res.setHeader('Content-Length', stat.size)
        res.setHeader('Content-Type', 'application/vnd.ms-powerpoint')
        res.setHeader('Content-Disposition', 'attachment; filename=template_' + req.params.langkey + '.ppt')
        filestream.pipe(res)
      }
    })
  })
  app.get('/actions/:id', login.isLoggedIn(), function (req, res) {
    database.getAction(req.params.id, function (error, result) {
      if (error) {
        res.status(503).json(error)
      } else {
        res.status(200).json(result)
      }
    })
  })
  app.put('/actions/:id/finalize', login.isLoggedIn(), function (req, res) {
    database.actionFinalize(req.params.id, function (error, result) {
      if (error) {
        res.status(503).json(error)
      } else {
        res.status(200).end()
      }
    })
  })
  app.get('/actions/:actionid/:page/layout', login.isLoggedIn(), function (req, res) {
    database.getLayoutImagesByActionPage(req.params.actionid, req.params.page, function (error, result) {
      if (error) {
        res.status(503).json(error)
      } else {
        res.status(200).json(result)
      }
    })
  })
  app.put('/actions/:id/:page/layout', login.isLoggedIn(), function (req, res) {
    database.saveLayout(req.params.id, req.params.page, req.body.id, function (error, result) {
      if (error) {
        res.status(503).json(error)
      } else {
        res.status(200).end()
      }
    })
  })
  app.get('/book/:action_id/', login.isLoggedIn(), function (req, res) {
    bookGenerator.createBook(req.params.action_id, req.cookies['resilienzManager-language'], function (error, path) {
      if (error) {
        res.status(503).json(error)
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
    database.getCategoriesFull(req.cookies['resilienzManager-language'], function (error, categories) {
      if (error) {
        res.status(503).json(error)
      } else {
        res.status(200).json(categories)
      }
    })
  })
  app.get('/bookimages/:name/', login.isLoggedIn(), function (req, res) {
    res.status(200).sendFile(config.images + '/' + req.params.name)
  })
  app.delete('/bookimages/:name/', login.isLoggedIn(), function (req, res) {
    database.removeImage(req.params.name, function (error, name) {
      if (error) {
        res.status(503).json(error)
      } else {
        res.status(200).end()
      }
    })
  })
  app.put('/bookimages/:name/rescale', login.isLoggedIn(), function (req, res) {
    layouter.rescaleImage(config.images + '/' + req.params.name, req.body.x1, req.body.y1, req.body.width, req.body.height, function (error) {
      if (error) {
        res.status(503).json(error)
      } else {
        res.status(200).end()
      }
    })
  })
  app.get('/bookimages/:action_id/:page', login.isLoggedIn(), function (req, res) {
    layouter.createPage(req.params.action_id, req.cookies['resilienzManager-language'], req.params.page, function (error, result) {
      if (error) {
        res.status(503).json(error)
      } else {
        if (result) {
          res.status(503).end()
        } else {
          if (req.params.page === '1' || req.params.page === '44') {
            res.status(200).sendFile(config.pages + '/' + req.params.action_id + '/' + req.params.page + '.png')
          } else {
            res.status(200).sendFile(config.pages + '/' + req.params.action_id + '/' + req.params.page + '_two.png')
          }
        }
      }
    })
  })
  app.get('/bookimages/:action_id/:page/:position_id', login.isLoggedIn(), function (req, res) {
    database.getImage(req.params.action_id, req.params.page, req.params.position_id, function (error, name) {
      if (error) {
        res.status(503).json(error)
      } else {
        res.status(200).sendFile(config.images + '/' + name)
      }
    })
  })
  app.post('/bookimages/upload/:action_id/:page/:position_id', login.isLoggedIn(), upload.single('dropzone'), function (req, res) {
    fs.readFile(req.file.path, function (err, data) {
      if (err) {
        return res.status(400).json(err)
      } else {
        var newFileName = uuidV4() + '.' + mime.extension(req.file.mimetype) || 'jpg'
        var writeFileName = config.images + '/' + newFileName
        fs.writeFile(writeFileName, data, function (err) {
          if (err) {
            err.filename = writeFileName
            return res.status(400).json(err)
          } else {
            database.addImage(req.params.action_id, req.params.page, req.params.position_id, newFileName, function (error) {
              if (error) {
                return res.status(400).json(error)
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
