const crypto = require('crypto');
require('dotenv').config();
const { Resend } = require('resend');
const cron = require('node-cron');
const PreRegistrationModel = require('../models/pregistration');



const generateOtp = () => {
    const otp = crypto.randomInt(1000, 9999); // Generates a 4-digit OTP
    return otp.toString();
};

const saveOtp = async (email, otp) => {
  const expirationTime = new Date(Date.now() + 5 * 60000); // OTP expires in 10 minutes
  await Teacher.updateOne({ email }, { $set: { otp, otpExpires: expirationTime } });
};


const resend = new  Resend(process.env.RESEND_VEREP_TEST);

const sendRegistrationEmail = async (email,  token , res) => {
    
    const registrationLink = `https://vrep-elementary-back-dev.onrender.com/staff/register/${encodeURIComponent(token)}`;

    try {
        const { data } = await resend.emails.send({
            from: "VREP <onboarding@resend.dev>",
            to: email,
            subject: "FROM VERP, REGISTER YOUR ACCOUNT",
            html: `<strong>Please register your account by clicking on the following link:</strong> <a href="${registrationLink}">Register</a>`,
            text: `Please register your account by clicking on the following link: ${registrationLink}`,
        });

        if (data) {
           console.log("Done");
            return;
        }
    } catch (error) {
        console.error('Error sending registration email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};


function validateEmail(email) {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (emailRegex.test(email)) {
        return true;
    } else {
        return 'Please enter a valid email';
    }
}

const  job = cron.schedule('0 0 * * *', async () => {
  try {
    // Get the current date and time
    const currentDate = new Date();

    // Find and delete expired tokens
    const deletedTokens = await PreRegistrationModel.deleteMany({ expires: { $lt: currentDate } }, { projection: { _id: 1 } });

    console.log(`Deleted ${deletedTokens.deletedCount} expired tokens.`);

    // Check if there are any more expired tokens
    const remainingTokens = await PreRegistrationModel.countDocuments({ expires: { $lt: currentDate } });

    if (remainingTokens === 0) {
      // Stop the cron job if there are no more expired tokens
      job.stop();
      console.log('Cron job stopped.');
    }
  } catch (error) {
    console.error(`Error deleting expired tokens: ${error}`);
  }
});

module.exports = { sendRegistrationEmail , validateEmail , job};
