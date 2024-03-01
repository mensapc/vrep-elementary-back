const { Resend } = require("resend");

const resend = new Resend("re_GkEMskU4_76tPbmzYM6LZoZzQh9s56m9m");

const sendMal = async ({ subject, to, htmlText }) => {
  return await resend.emails.send({
    from: "RPMS <onboarding@resend.dev>",
    to: ["openings@rulerspalacemontessori.com.ng"],
    subject: subject,
    html: htmlText,
  });
};

module.exports = { sendMal };
