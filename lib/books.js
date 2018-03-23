/**
 * @overview Book and Pages Generator Lib
 * @module books
 * @author Dominik Sigmund
 * @version 0.1
 * @description This Lib is the new way to create Pages and Books.
 * @memberof resilienz
 * @requires module:fs
 * @requires module:sync
 * @requires module:child_process
 * @requires bin:imagemagick
 */
var fs = require('fs')
var path = require('path')
var async = require('async')
const execSync = require('child_process').execSync
function Books (database, pagespath, imagepath, bookpath, bookpages) {
  var self = {}
  self.database = database
  self.pagespath = pagespath
  self.imagepath = imagepath
  self.bookpath = bookpath
  self.pages = bookpages
  self.createPage = createPage
  self.printTextField = printTextField
  self.addImage = addImage
  self.printNumber = printNumber
  self.removePage = removePage
  self.createIndex = createIndex
  self.copyFixed = copyFixed
  self.makeBook = makeBook
  self.rescaleImage = rescaleImage
  return self
}

function createPage (actionid, page, language, background, callback) { // -> creates one page
  var self = this
  self.database.getLayoutInfo(actionid, page, function (error, objects) {
    if (error) {
      return callback(error)
    } else {
      // if empty and page !== 0 || 2 return null
      // else if emtpy call removePage
      // else copy once empty, then loop and printStuff on the page

      // save page, name as [PAGENR]-[CAT].png
    }
  })
 // database --> page leads to chapter and background
}
function printTextField (target, object, callback) { // -> adds text to page
  // TODO: make better
  var text = object.value.split('|')[1]
                // remove 10% from width / height and add half value to x / y for centering
  var w10 = object.width / 10
  var h10 = object.height / 10
  var wnew = object.width - w10
  var hnew = object.height - h10
  var nx = object.x - (w10 / 2)
  var ny = object.y - (h10 / 2)
  var cmd = 'convert -font Helvetica -pointsize 200 -background white -fill \'#1e487a\' -gravity northwest -geometry \'' + wnew + 'x' + hnew + '!+' + nx + '+' + ny + '\' caption:"' + text + '" ' + target + ' +swap -gravity northwest -composite  ' + target
  console.log(cmd)
  var output = execSync(cmd, true)
  if (output.stderr || output.stdout) {
    console.log(output.stdout)
    console.error(output.stderr)
    callback(null, false)
  } else {
    callback(null, true)
  }
}
function addImage (target, object, callback) { // -> add image to page
  var imgname = object.value
  object.value = this.imagepath + '/' + object.value
  var rscmd = 'convert ' + object.value + ' -resize ' + object.width + 'x' + object.height + ' -background white -compose Copy -gravity center -extent ' + object.width + 'x' + object.height + ' /tmp/' + imgname
  console.log(rscmd)
  var output = execSync(rscmd, true)
  object.value = '/tmp/' + imgname
  var cmd = ''
  if (object.spin !== 0) {
    cmd = 'convert ' + target + ' null: \\( ' + object.value + ' -sample ' + object.width + 'x' + object.height + '! -background None -rotate ' + object.spin + ' \\) -geometry \'+' + object.x + '+' + object.y + '\' -layers Composite ' + target
  } else {
    cmd = 'composite -geometry \'' + object.width + 'x' + object.height + '!+' + object.x + '+' + object.y + '\' ' + object.value + ' ' + target + ' ' + target
  }
  console.log(cmd)
  output = execSync(cmd, true)
  if (output.stderr || output.stdout) {
    console.log(output.stdout)
    console.error(output.stderr)
    callback(null, false)
  } else {
    callback(null, true)
  }
}
function printNumber (actionid, page, callback) { // -> prints number on page
  var target = path.join(this.pagespath, actionid, page) + '.png'
  var cmd1 = 'convert ' + target + ' -font Helvetica -pointsize 24 -gravity southwest -stroke \'#000C\' -strokewidth 2 -annotate +50+10 \'' + page + '\' -stroke none -fill white -annotate +50+10 \'' + page + '\' ' + target
  var output1 = execSync(cmd1, true)
  if (output1.stderr || output1.stdout) {
    callback(output1.stderr || output1.stdout)
  } else {
    callback(null)
  }
}
function removePage (actionid, page, callback) { // -> removes a page from the build
  fs.unlink(path.join(path.join(this.pagespath, actionid, page) + '.png'), callback)
}
function createIndex (actionid, language, callback) { //  -> print indexpage (3)
  // TODO: create index of pages by using catNR.
  // use printTextField to print to 02_index.png
}
function copyFixed (actionid, language, callback) { // -> copies pages 2 and the last into the folder
  fs.copyFile(path.join(this.layoutpath + '/' + language + '/02_vorwort.png'), path.join(this.pagespath + '/' + actionid + '/02-00.png'), function (error) {
    if (error) {
      callback(error)
    } else {
      fs.copyFile(path.join(this.layoutpath + '/' + language + '/16_ruecken.png'), path.join(this.pagespath + '/' + actionid + '/99-00.png'), function (error) {
        if (error) {
          callback(error)
        } else {
          callback(null)
        }
      })
    }
  })
}
function makeBook (actionid, language, callback) { // -> combines existing pages
  // TODO copyfixed
  // get pages from folder
  // Split pages and save in list
  // createIndex
  // loop and print numbers
  // combine all pages
  // save
  // callback
}
function rescaleImage (image, x, y, width, height, clientWidth, clientHeight, orgWidth, orgHeight, callback) { // -> rescales Images and saves it.
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

/* Hints
* Check Frontend -> Routes
* Frontend: after succesful upload/textsave/delete -> generate page
*/

module.exports = Books
