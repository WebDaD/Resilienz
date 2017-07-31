/* global $ */
$(document).ready(function () {
  $('.reset-form').on('click', '#reset-submit', function () {
    $('#reset-error').hide()
    var errors = 0
    errors += checkField('reset_email')
    if (errors > 0) {
      error('Some Fields are Empty')
      return
    }
    $.post('/reset', {
      email: $('#reset_email').val(),
      captchaResponse: $('#g-recaptcha-response').val()
    }, function (data, textStatus, jqHXR) {
      if (textStatus === 'success') {
        $('#reset-ok').show()
        $('.reset-form').hide()
      } else {
        error(data.msg)
      }
    }).fail(function (data) {
      error(data.responseJSON.msg)
    })
  })
})
function error (msg) {
  $('#reset-error').text(msg).show()
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
