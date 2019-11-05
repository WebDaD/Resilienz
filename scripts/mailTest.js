const nodemailer = require('nodemailer')
const config = require('../config.json')

var transporter = nodemailer.createTransport(config.mail)

console.log('Sending TestMail')

var mailOptions = {
  from: '"Storytelling Club" <info@prixjeunesse.de>', // sender address
  to: 'sigmund.dominik@googlemail.com', // list of receivers
  subject: 'Test Mail from STC', // Subject line
  html: 'If you can read this, it worked!' // html body
}
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.error(error)
    console.error(mailOptions)
  } else {
    console.log('seems good')
    console.log(info)
  }
})