/* global $, window */
$(document).ready(function () {
  var languageString = navigator.language || navigator.userLanguage || ''
  var language = languageString.split(/[_-]/)[0].toLowerCase()
  if (!$.cookie('resilienzManager-language')) {
    $.cookie('resilienzManager-language', language, {expires: 365, path: '/'})
  }
  $('.lang-selector').click(function () {
    $.cookie('resilienzManager-language', $(this).data('lang'), {expires: 365, path: '/'})
    window.location = $(this).data('target')
  })
})
