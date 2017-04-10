/* global $ */
$(document).ready(function () {
  $('.set-form').on('click', '#set-submit', function () {
    $('#set-error').hide()
    var errors = 0
    errors += checkField('set-password')
    errors += checkField('set-passwordrepeat')
    if (errors > 0) {
      error('Some Fields are Empty')
      return
    }
    if ($('set-password').val() !== $('set-passwordrepeat').val()) {
      error('Passwords must match')
      $('#set-password').addClass('has-error')
      $('#set-passwordrepeat').addClass('has-error')
      return
    }
    $.post('/set_pwd', {
      email: $('#set-email').val(),
      resetToken: $('#set-resetToken').val(),
      password: $.md5($('#set-password').val()),
      captchaResponse: $('#g-recaptcha-response').val()
    }, function (data, textStatus, jqHXR) {
      if (textStatus === '200') {
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
    })
  })
})
function error (msg) {
  $('#set-error').text(msg).show()
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
