/**
 * @overview Layouter Lib
 * @module layouter
 * @author Dominik Sigmund
 * @version 0.1
 * @description Positions Images on Layouts
 * @memberof resilienz
 * @requires module:database
 * @requires module:fs
 * @requires module:child_process
 * @requires bin:imagemagick
 */
var fs = require('fs')
var mkdirp = require('mkdirp')
const execSync = require('child_process').execSync
function Layouter (layoutpath, imagepath, pagespath, database) {
  var self = {}
  self.imagepath = imagepath
  self.database = database
  self.pagespath = pagespath
  self.layoutpath = layoutpath
  self.createPage = createPage
  self.rescaleImage = rescaleImage
  self.getPage = getPage
  return self
}
function rescaleImage (image, x, y, width, height, callback) {
  var cmd = 'convert ' + image + ' -crop ' + width + 'x' + height + '' + '+' + x + '+' + y + ' ' + image
  console.log(cmd)
  var output = execSync(cmd, true)
  if (output.stderr || output.stdout) {
    console.log(output.stdout)
    console.error(output.stderr)
    callback(output)
  } else {
    callback(null)
  }
}
function createPage (actionid, language, page, callback) {
  var self = this
  mkdirp(self.pagespath + '/' + actionid + '/', function (error) {
    if (error) {
      callback(error)
    } else {
      self.database.getLayoutInfo(actionid, page, function (error, information) {
        if (error) {
          callback(error)
        } else {
          var cmd = ''
          var output = ''
          if (page === 2) {
            cmd = 'cp ' + self.layoutpath + '/' + language + '/02_inhalt.png' + self.pagespath + '/' + actionid + '/' + page + '_two.png'
            output = execSync(cmd)
          } else if (page === 44) {
            cmd = 'cp ' + self.layoutpath + '/' + language + '/16_ruecken.png ' + self.pagespath + '/' + actionid + '/' + page + '.png'
            output = execSync(cmd)
          } else {
            for (var i = 0; i < information.length; i++) {
              var info = information[i]
              if (info.image === '') {
                info.image = self.layoutpath + '/placeholder.png'
              } else {
                info.image = self.imagepath + '/' + info.image
              }
              var target = ''
              if (page === 1 || page === '1') {
                target = self.pagespath + '/' + actionid + '/' + page + '.png'
              } else {
                target = self.pagespath + '/' + actionid + '/' + page + '_two.png'
              }
              var bg = ''
              if (i === 0) {
                bg = self.layoutpath + '/' + language + '/' + info.background
              } else {
                bg = target
              }

              cmd = ''
              if (info.spin !== 0) {
                cmd = 'convert ' + bg + ' null: \\( ' + info.image + ' -sample ' + info.width + 'x' + info.height + '! -background None -rotate ' + info.spin + ' \\) -geometry \'+' + info.x + '+' + info.y + '\' -layers Composite ' + target
              } else {
                cmd = 'composite -geometry \'' + info.width + 'x' + info.height + '!+' + info.x + '+' + info.y + '\' ' + info.image + ' ' + bg + ' ' + target
              }
              console.log(cmd)
              output = execSync(cmd, true)
              if (output.stderr || output.stdout) {
                console.log(output.stdout)
                console.error(output.stderr)
                callback(null, false)
              }
            }
          }
          if (output) {
            callback(null, false)
          } else {
            callback(null, true)
          }
        }
      })
    }
  })
}

function getPage (actionid, language, page, callback) {
  var self = this
  var target = ''
  if (page === 1 || page === 44) {
    target = self.pagespath + '/' + actionid + '/' + page + '.png'
  } else {
    target = self.pagespath + '/' + actionid + '/' + page + '_two.png'
  }
  fs.access(target, fs.constants.R_OK | fs.constants.W_OK, function (error) {
    if (error) {
      self.createPage(actionid, language, page, function (error, result) {
        if (error) {
          callback(error)
        } else {
          if (result) {
            callback(null, target)
          } else {
            callback({msg: 'Error creating Image'})
          }
        }
      })
    } else {
      callback(null, target)
    }
  })
}

module.exports = Layouter
