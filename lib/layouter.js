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
function Layouter (layoutpath, imagepath, pagespath, database, maxPages) {
  var self = {}
  self.maxPages = maxPages
  self.imagepath = imagepath
  self.database = database
  self.pagespath = pagespath
  self.layoutpath = layoutpath
  self.createPage = createPage
  self.printNumbers = printNumbers
  self.rescaleImage = rescaleImage
  self.getPage = getPage
  return self
}
function rescaleImage (image, x, y, width, height, clientWidth, clientHeight, orgWidth, orgHeight, callback) {
  var newWidth = (width * orgWidth) / clientWidth
  var newHeight = (width * orgHeight) / clientHeight
  var newX = (x * orgWidth) / clientWidth
  var newY = (y * orgHeight) / clientHeight
  var cmd = 'convert ' + image + ' -crop ' + newWidth + 'x' + newHeight + '' + '+' + newX + '+' + newY + ' ' + image
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
  if (page === 0) {
    return callback(null, false)
  }
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
          var output = {}
          if (page === 2) {
            cmd = 'cp ' + self.layoutpath + '/' + language + '/02_inhalt.png ' + self.pagespath + '/' + actionid + '/' + page + '_two.png'
            output = execSync(cmd, true)
            if (output.stderr) {
              callback(null, false)
            } else {
              callback(null, self.printNumbers(self.pagespath + '/' + actionid + '/' + page + '_two.png', page))
            }
          } else if (page === self.maxPages || page.toString() === self.maxPages.toString()) {
            cmd = 'cp ' + self.layoutpath + '/' + language + '/16_ruecken.png ' + self.pagespath + '/' + actionid + '/' + page + '.png'
            output = execSync(cmd, true)
            if (output.stderr) {
              callback(null, false)
            } else {
              callback(null, true)
            }
          } else {
            var target = ''
            var printPageNumber = true
            if (page === 1 || page === '1') {
              target = self.pagespath + '/' + actionid + '/' + page + '.png'
              printPageNumber = false
            } else {
              target = self.pagespath + '/' + actionid + '/' + page + '_two.png'
            }
            for (var i = 0; i < information.length; i++) {
              var info = information[i]
              if (info.image === '') {
                info.image = self.layoutpath + '/placeholder_print.png'
              } else {
                info.image = self.imagepath + '/' + info.image
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
            }
            if (output.stderr || output.stdout) {
              console.log(output.stdout)
              console.error(output.stderr)
              callback(null, false)
            } else {
              if(printPageNumber) {
                callback(null, self.printNumbers(target, page))
              } else {
                callback(null, true)
              }
            }
          }
        }
      })
    }
  })
}

function getPage (actionid, language, page, callback) {
  var self = this
  var target = ''
  if (page === 1 || page === self.maxPages) {
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

function printNumbers(target, page) {
  cmd1 = 'convert ' + target + ' -font Helvetica -pointsize 24 -gravity southwest -stroke \'#000C\' -strokewidth 2 -annotate +50+10 \'' + page + '\' -stroke none -fill white -annotate +50+10 \'' + page + '\' ' + target
  output1 = execSync(cmd1, true)
  cmd2 = 'convert ' + target + ' -font Helvetica -pointsize 24 -gravity southeast -stroke \'#000C\' -strokewidth 2 -annotate +50+10 \'' + (page+1) + '\' -stroke none -fill white -annotate +50+10 \'' + (page+1) + '\' ' + target
  output2 = execSync(cmd2, true)
  if (output1.stderr || output1.stdout || output2.stderr || output2.stdout) {
    return false
  } else {
    return true
  }
}

module.exports = Layouter
