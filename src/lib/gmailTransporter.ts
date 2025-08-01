import { env } from '@/env';
import nodemailer from 'nodemailer';

// Create Gmail transporter with better error handling
export const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.GMAIL_USER, // your gmail address
        pass: env.GMAIL_APP_PASSWORD, // Gmail app password
    },
    // Additional options for better reliability
    tls: {
        rejectUnauthorized: false
    }
});



if (process.env.NODE_ENV !== "production") {
    // Test the connection
    gmailTransporter.verify((error) => {
        if (error) {
            console.error('❌ Gmail transporter error:', error);
        } else {
            console.log('✅ Gmail transporter is ready to send emails');
        }
    });
}