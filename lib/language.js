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
   self.getKeys = getKeys
   self.database.getTranslations(function (error, translations) {
     if (error) {
       callback(error)
     } else {
       self.translations = translations
       self.keys = self.getKeys()
       self.database.getLanguages(function (error, languages) {
         if (error) {
           callback(error)
         } else {
           self.languages = languages
           self.languageExists = languageExists
           self.keyExists = keyExists
           self.getString = getString
           self.listLanguages = listLanguages
           self.listKeys = listKeys
           self.listTranslation = listTranslation
           callback(null, self)
         }
       })
     }
   })
 }

 function getKeys () {
   var keys = {}
   var self = this
   for (var k in self.translations.en) {
     if (self.translations.en.hasOwnProperty(k)) {
       keys[k] = undefined
     }
   }
   return keys
 }
 function languageExists (language) {
   var self = this
   if (self.languages[language]) return true
   else return false
 }
 function keyExists (key) {
   var self = this
   if (self.keys.hasOwnProperty(key)) return true
   else return false
 }

 function getString (language, key) {
   var self = this
   if (self.languageExists(language)) {
     if (self.keyExists(key)) {
       return self.translations[language][key]
     } else {
       return 'KEY_ERR'
     }
   } else {
     return 'LANG_ERR'
   }
 }

 function listLanguages (callback) {
   var self = this
   callback(self.languages)
 }

 function listKeys (callback) {
   var self = this
   callback(self.keys)
 }

 function listTranslation (language, callback) {
   var self = this
   if (self.languageExists(language)) {
     callback(self.translations[language])
   } else {
     callback(self.translations.en)
   }
 }

 module.exports = Language
