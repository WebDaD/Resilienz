/* global $ */
$(document).ready(function () {
  var location = {
    latitude: 48.1437389,
    longitude: 11.5499916
  }
  $('#register_start').datetimepicker({timepicker: false, format: 'Y-m-d'})
  $('#register_stop').datetimepicker({timepicker: false, format: 'Y-m-d'})
  $('#register_location').locationpicker({
    location: {
      latitude: 48.1437389,
      longitude: 11.5499916
    },
    onchanged: function (currentLocation, radius, isMarkerDropped) {
      location = currentLocation
    },
    inputBinding: {
      locationNameInput: $('#register_location_text')
    }
  })
  $('.register_form').on('click', '#register_submit', function () {
    $('#register_error').hide()
    var errors = 0
    errors += checkField('register_language')
    errors += checkField('register_email')
    errors += checkField('register_vorname')
    errors += checkField('register_nachname')
    errors += checkField('register_password')
    errors += checkField('register_passwordrepeat')
    errors += checkField('register_start')
    errors += checkField('register_stop')
    if (errors > 0) {
      error('Some Fields are Empty')
      return
    }
    if ($('register_password').val() !== $('register_passwordrepeat').val()) {
      error('Passwords must match')
      $('#register_password').addClass('has-error')
      $('#register_passwordrepeat').addClass('has-error')
      return
    }
    $.post('/register', {
      register_language: $('#register_language').val(),
      register_email: $('#register_email').val(),
      register_vorname: $('#register_vorname').val(),
      register_nachname: $('#register_nachname').val(),
      register_password: $.md5($('#register_password').val()),
      register_location: location.longitude + ',' + location.latitude,
      register_start: $('#register_start').val() + ' 00:00:00',
      register_stop: $('#register_stop').val() + ' 00:00:00',
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
  $('#register_error').text(msg).show()
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
