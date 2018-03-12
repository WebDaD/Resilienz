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
  // TODO: add functions
  return self
}

/* Hints
* wenn Kapitel nicht bearbeitet wurde d.h. weder Text- noch Bildelemente, dann sollte es im finalisierten Buch auch nicht enthalten sein!
* Seitenzahlen automatisch generieren ab (Vorwort, S. 2)  in allen Sprachen
* im Inhaltsverzeichnis (IV) richtige Seitenzahlen sollen automatisch eingefügt werden
* Textausdruck verbessern
* Check Frontend -> Routes
* Frontend: after succesful upload/textsave/delete -> generate page
* if page is empty after delete, remove from build
*/

/* Functions:
* createPage() -> creates one page
    * printTextField() -> adds text to page
    * addImage() -> add image to page
    * printNumber() -> prints number on page
* removePage() -> removes a page from the build
* createIndex() -> print indexpage (3)
* copyFixed() -> copies pages 2 and the last
* makeBook() -> combines existing pages
* rescaleImage() -> rescales Images and saves it.
*/

module.exports = Books
