/* global $ */
$(document).ready(function () {
  $('.register-form').on('click', '#register-submit', function () {
    $('#register-error').hide()
    var errors = 0
    errors += checkField('register-language')
    errors += checkField('register-email')
    errors += checkField('register-vorname')
    errors += checkField('register-nachname')
    errors += checkField('register-password')
    errors += checkField('register-passwordrepeat')
    errors += checkField('register-location')
    errors += checkField('register-start')
    errors += checkField('register-stop')
    if (errors > 0) {
      error('Some Fields are Empty')
      return
    }
    if ($('register-password').val() !== $('register-passwordrepeat').val()) {
      error('Passwords must match')
      $('#register-password').addClass('has-error')
      $('#register-passwordrepeat').addClass('has-error')
      return
    }
    $.post('/register', {
      language: $('#register-language').val(),
      email: $('#register-email').val(),
      vorname: $('#register-vorname').val(),
      nachname: $('#register-nachname').val(),
      password: $.md5($('#register-password').val()),
      location: $('#register-location').val(),
      start: $('#register-start').val(),
      stop: $('#register-stop').val(),
      captchaResponse: $('#g-recaptcha-response').val()
    }, function (data, textStatus, jqHXR) {
      if (textStatus === 'success') {
        $.cookie('resilienzManager-admin', data.admin, {expires: 365, path: '/'})
        $.cookie('resilienzManager-id', data.id, {expires: 365, path: '/'})
        $.cookie('resilienzManager-action', data.action, {expires: 365, path: '/'})
        $.cookie('resilienzManager-email', data.email, {expires: 365, path: '/'})
        $.cookie('resilienzManager-token', data.token, {expires: 365, path: '/'})
        $.cookie('resilienzManager-language', data.language, {expires: 365, path: '/'})
        window.location.href = '/app'
      } else {
        error(data.msg)
      }
    }).fail(function (data) {
      error(data.responseJSON.msg)
    })
  })
})
function error (msg) {
  $('#register-error').text(msg).show()
}
function checkField (id) {
  $('#' + id).removeClass('has-error')
  if (!$('#' + id).val()) {
    $('#' + id).addClass('has-error')
    return 1
  } else {
    return 0
  }
}
