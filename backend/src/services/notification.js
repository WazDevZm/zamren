const nodemailer = require('nodemailer');

// Initialize Twilio only if credentials are provided
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  const twilio = require('twilio');
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

// Initialize email transporter only if credentials are provided
let emailTransporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  emailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

exports.sendSMS = async (phoneNumber, message) => {
  try {
    if (!twilioClient) {
      console.log('SMS (Mock):', phoneNumber, message);
      return { success: true, messageId: 'mock-sms-' + Date.now() };
    }
    
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('SMS Error:', error);
    return { success: false, error: error.message };
  }
};

exports.sendEmail = async (to, subject, text, html) => {
  try {
    if (!emailTransporter) {
      console.log('Email (Mock):', to, subject, text);
      return { success: true, messageId: 'mock-email-' + Date.now() };
    }
    
    const result = await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: html || text
    });
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email Error:', error);
    return { success: false, error: error.message };
  }
};
