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
   self.database.getTranslations(function (error, translations) {
     if (error) {
       callback(error)
     } else {
       self.translations = translations
       self.keys = getKeys()
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
   var keys = []
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

 function getString (language, key, callback) {
   if (this.languageExists(language)) {
     if (this.keyExists(key)) {
       callback(null, this.translations[language][key])
     } else {
       callback({msg: 'Key does not exist in this Language'})
     }
   } else {
     callback({msg: 'Language does not exist'})
   }
 }

 function listLanguages (callback) {
   callback(null, this.languages)
 }

 function listKeys (callback) {
   callback(null, this.keys)
 }

 function listTranslation (language, callback) {
   if (languageExists(language)) {
     callback(null, this.translations[language])
   } else {
     callback(null, this.translations['en'])
   }
 }

 module.exports = Language
