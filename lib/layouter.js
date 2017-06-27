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
const execSync = require('child_process').execSync
function Layouter (imagepath, pagespath, database) {
  var self = {}
  self.imagepath = imagepath
  self.database = database
  self.pagespath = pagespath
  self.createPage = createPage
  self.rescaleImage = rescaleImage
  self.getPage = getPage
  return self
}
function rescaleImage (image, x, y, width, height, callback) {
  var cmd = 'convert ' + image + ' -resize ' + width + 'x' + height + '!' + '+' + x + '+' + y + ' ' + image
  var output = execSync(cmd)
  if (output) {
    callback(output)
  } else {
    callback(null)
  }
}
function createPage (actionid, language, page, callback) {
  var self = this
  self.database.getLayoutInfo(actionid, page, function (error, information) { //TODO: if no data (no layout selected), use default layout (new sql)
    if (error) {
      callback(error)
    } else {
      for (var i = 0; i < information.length; i++) {
        var info = information[i]
        if (info.image === '') {
          info.image = self.layoutpath + '/placeholder.png'
        } else {
          info.image = self.imagepath + '/' + info.image
        }
        var target = ''
        if (page === 1 || page === 44) {
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

        var cmd = ''
        if (info.spin !== 0) {
          // Rotate clockwise about the origin (the upper left-hand corner) by an angle a by letting c = cos(a), s = sin(a), and using the following.
          // COS / SIN:  cos(info.spin * Math.PI / 180.0) and sin(info.spin * Math.PI / 180.0)
          // -affine c,s,-s,c
          cmd = 'composite -geometry \'' + info.width + 'x' + info.height + '+' + info.x + '+' + info.y + '\' ' +
          '-rotate ' + info.spin +
          ' ' + info.image + ' ' + bg + ' ' + target
        } else {
          cmd = 'composite -geometry \'' + info.width + 'x' + info.height + '+' + info.x + '+' + info.y + '\' ' + info.image + ' ' + bg + ' ' + target
        }
        var output = execSync(cmd)
        if (output) {
          callback(null, false)
        }
      }
      callback(null, true)
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
