mailer  = require 'nodemailer'

mailServer = mailer.createTransport 'SMTP',
  service: 'SendGrid'
  auth:
    user: process.env.SENDGRID_USERNAME
    pass: process.env.SENDGRID_PASSWORD

exports.send = (to, subject, message) ->
  options =
    from: 'checkcheckit@checkcheckit.com'
    to:   to
    subject: subject
    text: message

  mailServer.sendMail options, (error, response) ->
    if error
      console.log('mail error')
    else
      console.log('mail success')
