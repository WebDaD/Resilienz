/**
 * @overview Book and Pages Generator Lib
 * @module books
 * @author Dominik Sigmund
 * @version 0.1
 * @description This Lib is the new way to create Pages and Books.
 * @memberof resilienz
 * @requires module:fs
 * @requires module:path
 * @requires module:uuid
 * @requires module:child_process
 * @requires module:fs-copy-file-sync
 * @requires bin:imagemagick
 */
var fs = require('fs')
var path = require('path')
const uuidV4 = require('uuid/v4')
const execSync = require('child_process').execSync
const copyFileSync = require('fs-copy-file-sync')
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
  self.addPlaceholder = addPlaceholder
  self.printNumber = printNumber
  self.printAllNumbers = printAllNumbers
  self.createIndex = createIndex
  self.copyFixed = copyFixed
  self.combinePages = combinePages
  self.makeBook = makeBook
  self.getBook = getBook
  self.rescaleImage = rescaleImage
  return self
}

function createPage (actionid, category, page, language, id, removed, callback) { // -> creates one page
  var self = this
  self.database.getLayoutInfo(actionid, page, function (error, objects) {
    if (error) {
      if (callback) {
        return callback(error)
      } else {
        throw new Error(error)
      }
    } else {
      var values = 0
      for (let index = 0; index < objects.length; index++) {
        const o = objects[index]
        if (o.value !== '') {
          values++
        }
      }
      if (values === 0) { // no values, remove page
        try {
          fs.unlinkSync(path.join(self.pagespath, actionid) + '/tmp/' + category.padStart(2, '0') + '-' + page.padStart(2, '0') + '.png')
          fs.unlinkSync(path.join(self.pagespath, actionid) + '/book/' + category.padStart(2, '0') + '-' + page.padStart(2, '0') + '.png')
          fs.unlinkSync(path.join(self.pagespath, actionid) + '/book/' + category.padStart(2, '0') + '-' + (parseInt(page) + 1).toString().padStart(2, '0') + '.png')
          fs.unlinkSync(path.join(self.pagespath, actionid) + '/pages/' + category.padStart(2, '0') + '-' + page.padStart(2, '0') + '.png')
          fs.unlinkSync(path.join(self.pagespath, actionid) + '/pages/' + category.padStart(2, '0') + '-' + (parseInt(page) + 1).toString().padStart(2, '0') + '.png')
        } catch (e) {
          console.error(e)
          callback(null, false)
        }
        if (callback) {
          callback(null, true)
        } else {
          return true
        }
      } else {
        var background = path.join(self.layoutpath, language, objects[0].background)
        var target = path.join(self.pagespath, actionid) + '/tmp/' + category.padStart(2, '0') + '-' + page.padStart(2, '0') + '.png'
        if (!fs.existsSync(path.join(self.pagespath, actionid))) {
          fs.mkdirSync(path.join(self.pagespath, actionid))
        }
        if (!fs.existsSync(path.join(self.pagespath, actionid, 'tmp'))) {
          fs.mkdirSync(path.join(self.pagespath, actionid, 'tmp'))
        }
        if (!fs.existsSync(path.join(self.pagespath, actionid, 'pages'))) {
          fs.mkdirSync(path.join(self.pagespath, actionid, 'pages'))
        }
        if (!fs.existsSync(path.join(self.pagespath, actionid, 'book'))) {
          fs.mkdirSync(path.join(self.pagespath, actionid, 'book'))
        }
        try {
          fs.accessSync(target, fs.constants.R_OK | fs.constants.W_OK)
        } catch (err) {
          copyFileSync(background, target)
        }
        for (let index = 0; index < objects.length; index++) {
          const object = objects[index]
          console.log(id + ' >>> ' + object.id + '(' + object.type + ':' + object.value + ')')
          if (id.toString() === '-2' || id.toString() === object.id.toString()) { // -2 --> render all objects
            if (removed) { // removed, print whitespace
              self.addPlaceholder(target, object)
            } else {
              if (object.type === 'image' && object.value !== '') {
                self.addImage(target, object)
              } else if (object.type === 'text' && object.value !== '') { // text
                if (object.id.toString() === '1') { // Cover Text
                  self.printTextField(target, {
                    width: 1404,
                    height: 183,
                    x: 0,
                    y: 50,
                    value: object.value
                  }, 'Tempus Sans ITC TT', 298, '#0068d9', true, {
                    width: 1756,
                    height: 296,
                    x: 148,
                    y: 1572
                  })
                } else {
                  self.printTextField(target, object, 'Helvetica', 170, '#000000', false)
                }
              }
            }
          }
        }
        if (category === '1') {
          execSync('cp ' + target + ' ' + path.join(self.pagespath, actionid) + '/pages/' + category.padStart(2, '0') + '-' + page.padStart(2, '0') + '.png')
          execSync('cp ' + target + ' ' + path.join(self.pagespath, actionid) + '/book/' + category.padStart(2, '0') + '-' + page.padStart(2, '0') + '.png')
        } else {
          execSync('convert ' + target + ' -crop 2127x3072+0+0 ' + path.join(self.pagespath, actionid) + '/pages/' + category.padStart(2, '0') + '-' + page.padStart(2, '0') + '.png')
          execSync('convert ' + target + ' -crop 2127x3072+2128+0 ' + path.join(self.pagespath, actionid) + '/pages/' + category.padStart(2, '0') + '-' + (parseInt(page) + 1).toString().padStart(2, '0') + '.png')
        }
        if (callback) {
          callback(null, true)
        } else {
          return true
        }
      }
    }
  })
}
function printTextField (target, object, font, size, color, center, customPlaceholder) { // -> adds text to page
  if (customPlaceholder) {
    this.addPlaceholder(target, customPlaceholder)
  } else {
    this.addPlaceholder(target, object)
  }
  var cmd = 'convert ' + target + ' -size ' + object.width + 'x' + object.height + ' -family "' + font + '" -pointsize ' + size + ' -density 27.8x28.2 -fill "' + color + '" ' + (center ? '-gravity center' : '') + ' -annotate +' + object.x + '+' + object.y + ' "' + object.value + '" ' + target
  console.log(cmd)
  var output = execSync(cmd, true)
  if (output.stderr || output.stdout) {
    console.log(output.stdout)
    console.error(output.stderr)
    return false
  } else {
    return true
  }
}
function addImage (target, object) { // -> add image to page
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
    return false
  } else {
    return true
  }
}
function addPlaceholder (target, object) { // -> add image to page
  var self = this
  var imgname = uuidV4() + '.png'
  var printer = self.layoutpath + '/placeholder_print.png'
  var rscmd = 'convert ' + printer + ' -resize ' + object.width + 'x' + object.height + ' -background white -compose Copy -gravity center -extent ' + object.width + 'x' + object.height + ' /tmp/' + imgname
  console.log(rscmd)
  var output = execSync(rscmd, true)
  printer = '/tmp/' + imgname
  var cmd = ''
  if (object.spin && object.spin !== 0) {
    cmd = 'convert ' + target + ' null: \\( ' + printer + ' -sample ' + object.width + 'x' + object.height + '! -background None -rotate ' + object.spin + ' \\) -geometry \'+' + object.x + '+' + object.y + '\' -layers Composite ' + target
  } else {
    cmd = 'composite -geometry \'' + object.width + 'x' + object.height + '!+' + object.x + '+' + object.y + '\' ' + printer + ' ' + target + ' ' + target
  }
  console.log(cmd)
  output = execSync(cmd, true)
  if (output.stderr || output.stdout) {
    console.log(output.stdout)
    console.error(output.stderr)
    return false
  } else {
    return true
  }
}
function printNumber (actionid, page) { // -> prints number on page
  var gravity = ''
  var coordinates = ''
  if (parseInt(page.realNumber) % 2 === 0) {
    gravity = 'southwest'
    coordinates = '+50+10'
  } else {
    gravity = 'southwest'
    coordinates = '+4178+10'
  }
  var cmd = 'convert ' + page.pagesPath + ' -font Helvetica -pointsize 180 -density 27.8x28.2 -gravity ' + gravity + ' -stroke \'#000C\' -strokewidth 8 -annotate ' + coordinates + ' \'' + page.realNumber + '\' -stroke none -fill white -annotate ' + coordinates + ' \'' + page.realNumber + '\' ' + page.bookPath
  console.log(cmd)
  var output = execSync(cmd, true)
  if (output.stderr || output.stdout) {
    return output.stderr || output.stdout
  } else {
    return null
  }
}
function printAllNumbers (actionid, pages, callback) { // -> call printNumber for all pages
  for (let index = 0; index < pages.length; index++) {
    const page = pages[index]
    if (parseInt(page.cat) !== 1 && parseInt(page.cat) !== 99) {
      this.printNumber(actionid, page)
    }
  }
  callback(null)
}
function createIndex (actionid, language, pages, callback) { //  -> print indexpage (3) 01-03.png
  var self = this
  self.database.getCatNamesByLanguage(language, function (error, translations) {
    if (error) {
      callback(error)
    } else {
      copyFileSync(self.layoutpath + '/' + language + '/02_inhalt.png', self.pagespath + '/' + actionid + '/book/01-03.png')
      var startY = 1228
      for (let index = 1; index < translations.length; index++) {
        const chapter = translations[index]
        if (chapter.id === 2) {
          self.printTextField(self.pagespath + '/' + actionid + '/book/01-03.png', { // use printTextField to print first chapter to 02_01.png
            width: 1524,
            height: 136,
            x: 160,
            y: 700,
            value: chapter.translation + ' ... 2'
          }, 'Tempus Sans ITC TT', 198, '#0068d9', false)
        } else {
          var startpage = pages.find(function (x) {
            return parseInt(x.cat) === parseInt(chapter.id)
          })
          if (startpage) {
            self.printTextField(self.pagespath + '/' + actionid + '/book/01-03.png', { // use printTextField to print  chapter-list to 02_01.png
              width: 1524,
              height: 136,
              x: 160,
              y: startY,
              value: chapter.translation
            }, 'Tempus Sans ITC TT', 198, '#0068d9', false)
            self.printTextField(self.pagespath + '/' + actionid + '/book/01-03.png', { // use printTextField to print  chapter-list to 02_01.png
              width: 200,
              height: 136,
              x: 1880,
              y: startY,
              value: startpage.realNumber
            }, 'Tempus Sans ITC TT', 198, '#0068d9', false)
            startY += 120
          }
        }
      }
      callback(null)
    }
  })
}
function getPages (actionid, language, callback) { //  -> get All Pages from Folder
  var self = this
  fs.readdir(path.join(this.pagespath, actionid, 'pages'), function (error, files) {
    if (error) {
      callback(error)
    } else {
      var pages = []
      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        if (path.extname(file) === '.png') {
          var name = path.basename(file, '.png')
          var nsplit = name.split('-')
          var po = {
            page: parseInt(nsplit[1]),
            cat: parseInt(nsplit[0]),
            realNumber: -1,
            pagesPath: path.join(self.pagespath, actionid, 'pages', file),
            bookPath: path.join(self.pagespath, actionid, 'book', file)
          }
          pages.push(po)
        }
      }
      pages.push({
        page: 3,
        cat: 1,
        realNumber: -1,
        pagesPath: path.join(self.pagespath, actionid, 'pages', '01-03.png'),
        bookPath: path.join(self.pagespath, actionid, 'book', '01-03.png')
      })
      // sort by cat, page.
      pages.sort(function (a, b) {
        if (a.cat < b.cat) {
          return -1
        } else if (a.cat === b.cat) {
          if (a.page < b.page) {
            return -1
          } else if (a.page > b.page) {
            return 1
          } else { // a.page == b.page (should never happen)
            return 0
          }
        } else { // a.cat > b.cat
          return 1
        }
      })
      // create realNumber (loop, not for cats 00, 02, 99)
      var count = 1
      for (let index = 0; index < pages.length; index++) {
        const page = pages[index]
        if (page.cat !== '00' && page.cat !== '01' && page.cat !== '99') {
          page.realNumber = count
          count++
        }
      }
      callback(null, pages)
    }
  })
}
function copyFixed (actionid, language, callback) { // -> copies pages 2 and the last into the folder
  copyFileSync(path.join(this.layoutpath + '/' + language + '/02_vorwort.png'), path.join(this.pagespath + '/' + actionid + '/pages/01-02.png'))
  copyFileSync(path.join(this.layoutpath + '/' + language + '/16_ruecken.png'), path.join(this.pagespath + '/' + actionid + '/pages/99-00.png'))
  copyFileSync(path.join(this.layoutpath + '/' + language + '/02_vorwort.png'), path.join(this.pagespath + '/' + actionid + '/book/01-02.png'))
  copyFileSync(path.join(this.layoutpath + '/' + language + '/16_ruecken.png'), path.join(this.pagespath + '/' + actionid + '/book/99-00.png'))
  callback(null)
}
function combinePages (actionid, pages, callback) { // -> Combines Pages
  var pagesString = ''
  for (let index = 0; index < pages.length; index++) {
    const page = pages[index]
    pagesString += page.bookPath + ' '
  }
  var cmd = 'convert ' + pagesString + ' -density 27.8x28.2 -page a4 -compress Zip ' + this.bookpath + '/' + actionid + '.pdf'
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
if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart (targetLength, padString) { // eslint-disable-line no-extend-native
    targetLength = targetLength >> 0 // truncate if number or convert non-number to 0;
    padString = String((typeof padString !== 'undefined' ? padString : ' '))
    if (this.length > targetLength) {
      return String(this)
    } else {
      targetLength = targetLength - this.length
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length) // append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(this)
    }
  }
}
module.exports = Books
