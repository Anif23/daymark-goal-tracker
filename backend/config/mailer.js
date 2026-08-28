const nodemailer = require('nodemailer')

const sendOtp = async (email, otp, subject = 'Your Daymark verification code') => {
    const hasSmtpConfig = process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS &&
        !process.env.SMTP_HOST.includes('example.com') &&
        !process.env.SMTP_USER.includes('your-') &&
        !process.env.SMTP_PASS.includes('your-')

    if (!hasSmtpConfig) {
        if (process.env.SMTP_REQUIRED === 'true') {
            throw new Error('Email service is not configured')
        }

        console.log(`[email verification] OTP for ${email}: ${otp}`)
        return
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject,
            text: `Your Daymark verification code is ${otp}. It expires in 10 minutes.`,
        })
    } catch (error) {
        console.error('Unable to send OTP email:', error.message)
        throw error
    }
}

const sendResetOtp = (email, otp) => sendOtp(email, otp, 'Your Daymark password reset code')

module.exports = { sendOtp, sendResetOtp }
