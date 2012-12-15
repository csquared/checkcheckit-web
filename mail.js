(function() {
  var mailServer, mailer;

  mailer = require('nodemailer');

  mailServer = mailer.createTransport('SMTP', {
    service: 'SendGrid',
    auth: {
      user: process.env.SENDGRID_USERNAME,
      pass: process.env.SENDGRID_PASSWORD
    }
  });

  exports.send = function(to, subject, message) {
    var options;
    options = {
      from: 'checkcheckit@checkcheckit.com',
      to: to,
      subject: subject,
      text: message
    };
    return mailServer.sendMail(options, function(error, response) {
      if (error) {
        return console.log('mail error');
      } else {
        return console.log('mail success');
      }
    });
  };

}).call(this);
