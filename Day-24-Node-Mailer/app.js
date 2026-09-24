const sendEmail = require('./email');

// Example usage
sendEmail(
  'ankulsingh975@gmail.com',
  'Test Email Subject',
  'This is a test email sent with Nodemailer using OAuth2.',
  '<p>This is a test email sent with <b>Nodemailer</b> using OAuth2.</p>'
);