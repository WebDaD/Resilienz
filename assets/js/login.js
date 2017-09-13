/* global $ */
$(document).ready(function () {
  $('.login-form').on('click', '#login-submit', function () {
    $('#register_submit').hide()
    $('#loading').show()
    $('#login-error').hide()
    var errors = 0
    errors += checkField('login-email')
    errors += checkField('login-password')
    if (errors > 0) {
      error('Some Fields are Empty')
      return
    }
    $.post('/login', {
      email: $('#login-email').val(),
      password: $.md5($('#login-password').val()),
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
        $('#register_submit').show()
        $('#loading').hide()
      }
    }).fail(function (data) {
      error(data.responseJSON.msg)
      $('#register_submit').show()
      $('#loading').hide()
    })
  })
})
function error (msg) {
  $('#login-error').text(msg).show()
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
