/**
 * @overview 	Layouter Lib
 * @module layouter
 * @author Dominik Sigmund
 * @version 0.1
 * @description	Positions Images on Layouts
 * @memberof resilienz
 * @requires module:database
 * @requires module:fs
 * @requires bin:imagemagick
 */
 var fs = require('fs')
 function Layouter (imagepath, database) {
   var self = {}
   self.imagepath = imagepath
   self.database = database
   return self;
 }
 
 BookGenerator.prototype.createPage = function (actionid, callback) {
   
 }
 
 BookGenerator.prototype.getPage = function (actionid, callback) {
   
 }
 
 module.exports = Layouter