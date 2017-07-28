/**
 * @overview Book-Generator Lib
 * @module bookGenerator
 * @author Dominik Sigmund
 * @version 0.1
 * @description Creates pdfs from Images
 * @memberof resilienz
 * @requires module:fs
 * @requires module:sync
 * @requires module:child_process
 * @requires bin:imagemagick
 */
 var fs = require('fs')
 var Sync = require('sync')
 const execSync = require('child_process').execSync
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

 function createBook (actionid, language, callback) {
   var self = this
   fs.readdir(self.pagespath + '/' + actionid, function (error, files) {
     if (error) {
       fs.mkdir(self.pagespath + '/' + actionid, function (error) {
         if (error) {
           callback(error)
         } else {
           fs.readdir(self.pagespath + '/' + actionid, function (error, files) {
             if (error) {
               callback(error)
             } else {
               composeFiles(self.layouter, self.pagespath, actionid, language, files, self.pages, function (error, parm) {
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
       })
     } else {
       composeFiles(self.layouter, self.pagespath, actionid, language, files, self.pages, function (error, parm) {
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

 function composeFiles (layouter, pagespath, actionid, language, files, maxPages, callback) {
   var parameter = ''
   for (var i = 1; i <= maxPages; i++) {
     if (i !== 1 && i % 2 !== 0) continue
     var split = false
     var target = ''
     if (i === 1 || i === 44) {
       target = pagespath + '/' + actionid + '/' + i + '.png'
     } else {
       target = pagespath + '/' + actionid + '/' + i + '_two.png'
       split = true
     }
     Sync(function () { // https://github.com/ybogdanov/node-sync/blob/master/examples/simple.js
       layouter.createPage.sync(null, actionid, language, i)
     })
     if (split) {
       // convert -crop 720x1040 image.png cropped_%d.png
       execSync('convert -crop 720x1040 ' + target + ' /tmp/splitted_$d.png') // to tmp
       execSync('mv /tmp/splitted_1.png ' + pagespath + '/' + actionid + '/' + i + '.png')
       execSync('mv /tmp/splitted_2.png ' + pagespath + '/' + actionid + '/' + (i + 1) + '.png')
       parameter += pagespath + '/' + actionid + '/' + i + '.png '
       parameter += pagespath + '/' + actionid + '/' + (i + 1) + '.png '
     } else {
       parameter += target + ' '
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
