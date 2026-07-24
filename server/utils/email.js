import nodemailer from 'nodemailer';
import prisma from '../lib/prisma.js';


export const sendEmail = async ({ to, subject, text, html, userId }) => {
    try {
        // Fetch SMTP settings for the user
        const settings = await prisma.setting.findUnique({ where: { userId } });

        if (!settings || !settings.smtpHost || !settings.smtpUser || !settings.smtpPass) {
            throw new Error('SMTP settings not configured correctly.');
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: settings.smtpHost,
            port: parseInt(settings.smtpPort),
            secure: parseInt(settings.smtpPort) === 465, // true for 465, false for other ports
            auth: {
                user: settings.smtpUser,
                pass: settings.smtpPass,
            },
        });

        // Setup email data
        const mailOptions = {
            from: settings.smtpFrom || settings.smtpUser,
            to,
            subject,
            text,
            html,
        };

        // Send mail
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
