const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
module.exports = sgMail;

console.log("✅ API Key cargada:", process.env.SENDGRID_API_KEY);


