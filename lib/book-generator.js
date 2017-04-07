/**
 * @overview Book-Generator Lib
 * @module bookGenerator
 * @author Dominik Sigmund
 * @version 0.1
 * @description Creates pdfs from Images
 * @memberof resilienz
 * @requires module:fs
 * @requires module:child_process
 * @requires bin:imagemagick
 */
 var fs = require('fs')
 const exec = require('child_process').exec
 function BookGenerator (layouter, pagespath, bookpath, bookpages) {
   var self = {}
   self.pagespath = pagespath
   self.bookpath = bookpath
   self.pages = bookpages
   self.layouter = layouter
   self.createBook = createBook
   self.getBook = getBook
   return self
 }

 function createBook (actionid, callback) {
   var self = this
   fs.readdir(self.pagespath + '/' + actionid, function (error, files) {
     if (error) {
       fs.mkdir(self.pagespath + '/' + actionid, function (error) {
         if (error) {
           callback(error)
         } else {
           composeFiles(self.layouter, self.pagespath, actionid, files, self.pages, function (error, parm) {
             if (error) {
               callback(error)
             } else {
               makePDF(self.bookpath, parm, actionid, function (error) {
                 if (error) {
                   callback(error)
                 } else {
                   callback(null, self.bookpath + '/' + actionid + '.pdf')
                 }
               })
             }
           })
         }
       })
     } else {
       composeFiles(self.layouter, self.pagespath, actionid, files, self.pages, function (error, parm) {
         if (error) {
           callback(error)
         } else {
           makePDF(self.bookpath, parm, actionid, function (error) {
             if (error) {
               callback(error)
             } else {
               callback(null, self.bookpath + '/' + actionid + '.pdf')
             }
           })
         }
       })
     }
   })
 }

 function composeFiles (layouter, pagespath, actionid, files, maxPages, callback) {
   var parameter = ''
   for (var i = 1; i <= maxPages; i++) {
     var p = pagespath + '/' + actionid + '/' + i + '.jpg'
     try {
       fs.accessSync(p, fs.constants.R_OK | fs.constants.W_OK)
     } catch (ex) {
       layouter.createPageSync(actionid, i)
     } finally {
       parameter += p + ' '
     }
   }
   callback(null, parameter)
 }

 function makePDF (bookpath, parameter, actionid, callback) {
   exec('convert ' + parameter + '-compress Zip ' + bookpath + '/' + actionid + '.pdf', function (error) {
     if (error) {
       callback(error)
     } else {
       callback(null)
     }
   })
 }

 function getBook (actionid, callback) {
   var self = this
   fs.access(self.bookpath + '/' + actionid + '.pdf', fs.constants.R_OK | fs.constants.W_OK, function (error) {
     if (error) {
       self.createBook(actionid, function (error) {
         if (error) {
           callback(error)
         } else {
           callback(null, self.bookpath + '/' + actionid + '.pdf')
         }
       })
     } else {
       callback(null, self.bookpath + '/' + actionid + '.pdf')
     }
   })
 }

 module.exports = BookGenerator
