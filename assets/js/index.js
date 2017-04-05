/* global $, location */
var languageString = navigator.language || navigator.userLanguage || ''
var language = languageString.split(/[_-]/)[0].toLowerCase()
if (!$.cookie('resilienzManager-language')) {
  $.cookie('resilienzManager-language', language, {expires: 365, path: '/'})
  location.reload(true)
}
