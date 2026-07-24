import axios from 'axios';
import prisma from '../lib/prisma.js';

export const sendSMS = async ({ to, body, userId }) => {
  try {
    // 1. Fetch settings for the user
    const settings = await prisma.setting.findUnique({ where: { userId } });

    // 2. Check if SMS is enabled globally
    if (!settings || !settings.enableSMS) {
      console.log('SMS service is disabled or settings not found. Skipping SMS.');
      return null;
    }

    // 3. Load Twilio credentials from environment
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      console.warn('Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) are missing in environment variables. Cannot send SMS.');
      return null;
    }

    // 4. Format to and from numbers (ensure proper E.164 formatting)
    let formattedTo = to.trim();
    if (!formattedTo.startsWith('+')) {
      // If no country code, default to Pakistan (+92) if it starts with 0 or 3
      if (formattedTo.startsWith('0')) {
        formattedTo = '+92' + formattedTo.slice(1);
      } else if (formattedTo.startsWith('3')) {
        formattedTo = '+92' + formattedTo;
      } else {
        formattedTo = '+' + formattedTo;
      }
    }

    console.log(`Sending SMS via Twilio to ${formattedTo}...`);

    // 5. Basic Auth header base64 encoding
    const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    // 6. URL Encoded parameters
    const params = new URLSearchParams();
    params.append('From', fromNumber);
    params.append('To', formattedTo);
    params.append('Body', body);

    // 7. Make direct Twilio API POST call
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      params,
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log(`SMS successfully sent to ${formattedTo}. SID: ${response.data.sid}`);
    return response.data;
  } catch (error) {
    console.error('Error in sendSMS service:', error.response?.data || error.message);
    throw error;
  }
};
