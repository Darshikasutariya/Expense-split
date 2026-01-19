import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create email transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify email 
transporter.verify((error, success) => {
    if (error) {
        console.error('Email configuration failed:', error.message);
    } else {
        console.log('Email server is ready to send messages', success);
    }
});

export default transporter;
