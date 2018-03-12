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
var async = require('async')
const execSync = require('child_process').execSync
function Books (database, layouter, pagespath, bookpath, bookpages) {
  var self = {}
  self.database = database
  self.pagespath = pagespath
  self.bookpath = bookpath
  self.pages = bookpages
  self.layouter = layouter
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

}
function printTextField (actionid, page, x, y, width, height, background, text, callback) { // -> adds text to page

}
function addImage (actionid, page, x, y, width, height, background, imagename, callback) { // -> add image to page

}
function printNumber (actionid, page, language, callback) { // -> prints number on page

}
function removePage (actionid, page, language, callback) { // -> removes a page from the build

}
function createIndex (actionid, language, callback) { //  -> print indexpage (3)

}
function copyFixed (actionid, language, callback) { // -> copies pages 2 and the last

}
function makeBook (actionid, language, callback) { // -> combines existing pages

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
* wenn Kapitel nicht bearbeitet wurde d.h. weder Text- noch Bildelemente, dann sollte es im finalisierten Buch auch nicht enthalten sein!
* Seitenzahlen automatisch generieren ab (Vorwort, S. 2)  in allen Sprachen
* im Inhaltsverzeichnis (IV) richtige Seitenzahlen sollen automatisch eingefügt werden
* Textausdruck verbessern
* Check Frontend -> Routes
* Frontend: after succesful upload/textsave/delete -> generate page
* if page is empty after delete, remove from build
* manche Bilder sind verzerrt (wenn Bild zu groß)  so einstellen, dass Bild dann automatisch verkleinert wird/angepasst wird!
*/

module.exports = Books
