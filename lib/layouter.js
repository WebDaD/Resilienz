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
  return self
}

Layouter.prototype.createPageSync = function (actionid, page) {
  var self = this
  self.database.getLayoutInfo(actionid, page, function (error, information) {
    if (error) {
      throw error
    } else {
      for (var i = 0; i < information.length; i++) {
        var info = information[i]
        var output = execSync('composite -geometry \'' + info.width + 'x' + info.height + '+' + info.x + '+' + info.y + '\' ' + self.imagepath + '/' + info.image + ' ' + self.layoutpath + '/' + info.layout + ' ' + self.pagespath + '/' + actionid + '/' + page + '.jpg')
        if (output) {
          throw error
        }
      }
      return true
    }
  })
}

Layouter.prototype.getPage = function (actionid, page, callback) {
  var self = this
  fs.access(self.pagespath + '/' + actionid + '/' + page + '.jpg', fs.constants.R_OK | fs.constants.W_OK, function (error) {
    if (error) {
      try {
        self.createPageSync(actionid, page)
        callback(null, self.pagespath + '/' + actionid + '/' + page + '.jpg')
      } catch (e) {
        callback(e)
      }
    } else {
      callback(null, self.pagespath + '/' + actionid + '/' + page + '.jpg')
    }
  })
}

module.exports = Layouter
