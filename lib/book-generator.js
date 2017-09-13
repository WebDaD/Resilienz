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
 var async = require('async')
 const execSync = require('child_process').execSync
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
               composeFiles(self.layouter, self.pagespath, actionid, language, self.pages, function (error, parm) {
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
       composeFiles(self.layouter, self.pagespath, actionid, language, self.pages, function (error, parm) {
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

 function createPage (layouter, actionid, language, pagespath, maxPages, page, callback) {
   var self = this
   layouter.createPage(actionid, language, page, function (error, result) {
     if (error) {
       callback(error)
     } else {
       var split = false
       var target = ''
       if (page === 1 || page === maxPages) {
         target = pagespath + '/' + actionid + '/' + page + '.png'
       } else {
         target = pagespath + '/' + actionid + '/' + page + '_two.png'
         split = true
       }
       var parameter = ''
       if (split) {
       // convert -crop 720x1040+721+0 image.png cropped_%d.png
         execSync('convert ' + target + ' -crop 720x1040+0+0 ' + pagespath + '/' + actionid + '/' + page + '.png')
         execSync('convert ' + target + ' -crop 720x1040+721+0 ' + pagespath + '/' + actionid + '/' + (page + 1) + '.png')
         parameter = pagespath + '/' + actionid + '/' + page + '.png '
         parameter += pagespath + '/' + actionid + '/' + (page + 1) + '.png'
       } else {
         parameter = target
       }
       callback(null, parameter)
     }
   })
 }

 function composeFiles (layouter, pagespath, actionid, language, maxPages, callback) {
   async.times(maxPages + 1, function (n, next) {
     if (n !== 1 && n % 2 !== 0) {
       next(null, '')
     } else if (n === 0) {
       next(null, '')
     } else {
       createPage(layouter, actionid, language, pagespath, maxPages, n, function (error, parameter) {
         next(error, parameter)
       })
     }
   }, function (error, parameters) {
     if (error) {
       console.error(error)
       callback(error)
     } else {
       callback(null, parameters)
     }
   })
 }

 function makePDF (bookpath, parameters, actionid, callback) {
   var parameter = ''
   parameters.forEach(function (listItem, index) {
     if (listItem !== '') {
       parameter += listItem + ' '
     }
   })
   var cmd = 'convert ' + parameter + '  -density 600 -resize 575x823 -gravity center -background white -extent 595x842 -compress Zip ' + bookpath + '/' + actionid + '.pdf'
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

 function getBook (actionid, callback) {
   var self = this
   fs.access(self.bookpath + '/' + actionid + '.pdf', fs.constants.R_OK | fs.constants.W_OK, function (error) {
     if (error) {
       callback(error)
     } else {
       callback(null, self.bookpath + '/' + actionid + '.pdf')
     }
   })
 }

 module.exports = BookGenerator
