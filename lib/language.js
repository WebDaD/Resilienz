/**
 * @overview Languages Lib
 * @module language
 * @author Dominik Sigmund
 * @version 0.1
 * @description Sends Language-Strings from the Database
 * @memberof resilienz
 * @requires module:database
 */
 function Language (database, callback) {
   var self = {}
   self.database = database
   database.getTranslations(function (error, translations) {
     if (error) {
       callback(error)
     } else {
       self.translations = translations
       self.keys = getKeys()
       database.getLanguages(function (error, languages) {
         if (error) {
           callback(error)
         } else {
           self.languages = languages
           callback(null, self)
         }
       })
     }
   })
 }

 function getKeys () {
   var keys = {}
   var self = this
   for (var k in self.translations[0]) keys.push(k)
   return keys
 }
 function languageExists (language) {
   if (this.languages[language]) return true
   else return false
 }
 function keyExists (key) {
   if (this.keys[key]) return true
   else return false
 }

 Language.prototype.getString = function (language, key, callback) {
   if (languageExists(language)) {
     if (keyExists(key)) {
       callback(null, this.translations[language][key])
     } else {
       callback({msg: 'Key does not exist in this Language'})
     }
   } else {
     callback({msg: 'Language does not exist'})
   }
 }

 Language.prototype.listLanguages = function (callback) {
   callback(null, this.languages)
 }

 Language.prototype.listKeys = function (callback) {
   callback(null, this.keys)
 }

 Language.prototype.listTranslation = function (language, callback) {
   if (languageExists(language)) {
     callback(null, this.translations[language])
   } else {
     callback(null, this.translations['en'])
   }
 }

 module.exports = Language
