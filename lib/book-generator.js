/**
 * @overview 	Book-Generator Lib
 * @module bookGenerator
 * @author Dominik Sigmund
 * @version 0.1
 * @description	Creates pdfs from Images and Database Data
 * @memberof resilienz
 * @requires module:database
 * @requires module:fs
 * @requires bin:imagemagick
 */
 var fs = require('fs')
 function BookGenerator (imagepath, bookpath, database) {
   var self = {}
   self.imagepath = imagepath
   self.bookpath = bookpath
   self.database = database
   return self;
 }
 
 BookGenerator.prototype.createBook = function (actionid, callback) {
   
 }
 
 BookGenerator.prototype.getBook = function (actionid, callback) {
   
 }
 
 module.exports = BookGenerator