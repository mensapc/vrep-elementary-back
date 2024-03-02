const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ subject, to, htmlText }) => {
  return await resend.emails.send({
    from: 'RPMS <onboarding@resend.dev>',
    to: ['openings@rulerspalacemontessori.com.ng'],
    subject: subject,
    html: htmlText,
  });
};

module.exports = { sendMail };
