/**
 * @overview Book and Pages Generator Lib
 * @module books
 * @author Dominik Sigmund
 * @version 0.1
 * @description This Lib is the new way to create Pages and Books.
 * @memberof resilienz
 * @requires module:fs
 * @requires module:path
 * @requires module:child_process
 * @requires bin:imagemagick
 */
var fs = require('fs')
var path = require('path')
const execSync = require('child_process').execSync
function Books (database, layoutpath, pagespath, imagepath, bookpath) {
  var self = {}
  self.database = database
  self.layoutpath = layoutpath
  self.pagespath = pagespath
  self.imagepath = imagepath
  self.bookpath = bookpath
  self.createPage = createPage
  self.getPages = getPages
  self.printTextField = printTextField
  self.addImage = addImage
  self.printNumber = printNumber
  self.printAllNumbers = printAllNumbers
  self.removePage = removePage
  self.createIndex = createIndex
  self.copyFixed = copyFixed
  self.combinePages = combinePages
  self.makeBook = makeBook
  self.getBook = getBook
  self.rescaleImage = rescaleImage
  return self
}

function createPage (actionid, category, page, language, callback) { // -> creates one page
  var self = this
  self.database.getLayoutInfo(actionid, page, function (error, objects) {
    if (error) {
      return callback(error)
    } else {
      // TODO: do this
      // if empty and page !== 0 || 2 return null
      // else if emtpy call removePage
      // else copy once empty, then loop and printStuff on the page

      // save page, name as [PAGENR]-[CAT].png
    }
  })
 // database --> page leads to chapter and background
 // callback HAS page path
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
function printNumber (actionid, page) { // -> prints number on page
  var target = path.join(this.pagespath, actionid, page) + '.png'
  var cmd1 = 'convert ' + target + ' -font Helvetica -pointsize 24 -gravity southwest -stroke \'#000C\' -strokewidth 2 -annotate +50+10 \'' + page + '\' -stroke none -fill white -annotate +50+10 \'' + page + '\' ' + target
  var output1 = execSync(cmd1, true)
  if (output1.stderr || output1.stdout) {
    return output1.stderr || output1.stdout
  } else {
    return null
  }
}
function printAllNumbers (actionid, pages, callback) { // -> call printNumber for all pages
  // TODO: printNumbers. Not for 1, 2, 3 and the lastPage!
  for (let index = 0; index < pages.length; index++) {
    const page = pages[index]
    this.printNumber(actionid, page)
  }
}
function removePage (actionid, page, callback) { // -> removes a page from the build
  fs.unlink(path.join(path.join(this.pagespath, actionid, page) + '.png'), callback)
}
function createIndex (actionid, language, pages, callback) { //  -> print indexpage (3)
  // TODO: create index of pages by using catNR.
  // pages array of objects: {page, cat, path}
  // use database to get Strings
  // remember that there are the index page itself and startpage (no number) and the endpage
  // use printTextField to print to 02_index.png
}
function getPages (actionid, language, callback) { //  -> get All Pages from Folder
  // TODO: fs get pages
  // sort by cat, page
  // callback array of objects: {page, cat, path}
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
function combinePages (actionid, pages, callback) { // -> Combines Pages
  var pagesString = ''
  for (let index = 0; index < pages.length; index++) {
    const page = pages[index]
    pagesString += page.path
  }
  var cmd = 'convert ' + pagesString + '  -density 27.8x28.2 -page a4 -compress Zip ' + this.bookpath + '/' + actionid + '.pdf'
  console.log(cmd)
  var output = execSync(cmd, true)
  if (output.stderr || output.stdout) {
    console.log(output.stdout)
    console.error(output.stderr)
    callback(output)
  } else {
    callback(null, this.bookpath + '/' + actionid + '.pdf')
  }
}
function makeBook (actionid, language, callback) { // -> creates Book
  var self = this
  self.copyFixed(actionid, language, function (error) {
    if (error) {
      callback(error)
    } else {
      self.getPages(actionid, language, function (error, pages) {
        if (error) {
          callback(error)
        } else {
          self.createIndex(actionid, language, pages, function (error) {
            if (error) {
              callback(error)
            } else {
              self.printAllNumbers(actionid, pages, function (error) {
                if (error) {
                  callback(error)
                } else {
                  self.combinePages(actionid, pages, function (error, pdf) {
                    if (error) {
                      callback(error)
                    } else {
                      callback(null, pdf)
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}
function getBook (actionid, callback) { // -> just send book
  var self = this
  fs.access(self.bookpath + '/' + actionid + '.pdf', fs.constants.R_OK | fs.constants.W_OK, function (error) {
    if (error) {
      callback(error)
    } else {
      callback(null, self.bookpath + '/' + actionid + '.pdf')
    }
  })
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

module.exports = Books
