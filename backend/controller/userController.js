const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { sendOtp, sendResetOtp } = require('../config/mailer')

const generateJWTToken = ({ id }) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: process.env.JWT_SECRET_EXPIRY
    })
}

const userController = {

    login: async (req, res) => {
        const { username, password } = req.body || {}
        const identifier = username?.trim()

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Please fill all the required fields' })
        }

        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier.toLowerCase() }]
        })

        if (!user) {
            return res.status(401).json({ message: 'Username not registered yet' })
        }

        const passwordMatches = await bcrypt.compare(password, user.password)

        if (!passwordMatches) {
            return res.status(401).json({ message: 'Username or password not matched' })
        }

        const safeUser = { _id: user._id, name: user.name, username: user.username, email: user.email, emailVerified: user.emailVerified }

        res.status(200).json({
            message: 'Logged in successfully',
            user: safeUser,
            token: generateJWTToken({ id: user._id })
        })
    },
    register: async (req, res) => {
        try {
            const { name, username, email, password } = req.body || {}

            if (!name?.trim() || !username?.trim() || !email?.trim() || !password || password.length < 6) {
                return res.status(400).json({ message: 'Please fill all the required fields' })
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const normalizedEmail = email.trim().toLowerCase()
            const verificationOtp = crypto.randomInt(100000, 1000000).toString()
            const user = await User.create({
                name: name.trim(), username: username.trim(), email: normalizedEmail, password: hashedPassword,
                emailVerified: false,
                verificationOtpHash: crypto.createHash('sha256').update(verificationOtp).digest('hex'),
                verificationOtpExpires: new Date(Date.now() + 10 * 60 * 1000)
            })

            try {
                await sendOtp(normalizedEmail, verificationOtp)
            } catch (error) {
                await User.deleteOne({ _id: user._id })
                return res.status(503).json({ message: 'Unable to send verification email. Please try again later' })
            }
            res.status(201).json({ message: 'Account created. Please verify your email before signing in.', email: normalizedEmail })
        } catch (error) {
            if (error.code === 11000) {
                const duplicateField = Object.keys(error.keyPattern || {})[0]
                const message = duplicateField === 'email'
                    ? 'This email is already taken, please use another email'
                    : 'This username is already taken, please use another username'

                return res.status(409).json({ message })
            }

            res.status(500).json({ message: error.message })
        }
    },
    logout: async (req, res) => {
        res.status(200).json({
            message: 'Logged out successfully'
        })
    },
    getMe: async (req, res) => {
        const { _id, name, username, email } = await User.findById(req.user.id)

        res.status(200).json({
            message: 'Profile fetched successfully',
            user: {
                _id,
                name,
                username,
                email,
                emailVerified: req.user.emailVerified,
                pendingEmail: req.user.pendingEmail
            }
        })
    },
    verifyEmail: async (req, res) => {
        const { email, otp } = req.body || {}
        const normalizedEmail = email?.trim().toLowerCase()
        const normalizedOtp = otp?.toString().trim()
        const user = await User.findOne({ $or: [{ email: normalizedEmail }, { pendingEmail: normalizedEmail }] })
        const otpHash = normalizedOtp && crypto.createHash('sha256').update(normalizedOtp).digest('hex')

        if (!user || !/^[0-9]{6}$/.test(normalizedOtp || '') || user.verificationOtpHash !== otpHash || !user.verificationOtpExpires || user.verificationOtpExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired verification code' })
        }

        if (user.pendingEmail) user.email = user.pendingEmail
        user.pendingEmail = undefined
        user.emailVerified = true
        user.verificationOtpHash = undefined
        user.verificationOtpExpires = undefined
        await user.save()
        res.status(200).json({ message: 'Email verified successfully' })
    },
    resendVerification: async (req, res) => {
        const email = req.body?.email?.trim().toLowerCase()
        const user = await User.findOne({ $or: [{ email }, { pendingEmail: email }] })

        if (!user || user.emailVerified) return res.status(200).json({ message: 'If the account exists, a verification code has been sent' })

        const otp = crypto.randomInt(100000, 1000000).toString()
        user.verificationOtpHash = crypto.createHash('sha256').update(otp).digest('hex')
        user.verificationOtpExpires = new Date(Date.now() + 10 * 60 * 1000)
        const destination = user.pendingEmail || user.email
        await sendOtp(destination, otp)
        await user.save()
        res.status(200).json({ message: 'If the account exists, a verification code has been sent' })
    },
    requestVerification: async (req, res) => {
        const user = await User.findById(req.user.id)
        const email = user?.pendingEmail || user?.email

        if (!user || (user.emailVerified && !user.pendingEmail)) {
            return res.status(400).json({ message: 'Your email is already verified' })
        }

        const otp = crypto.randomInt(100000, 1000000).toString()
        user.verificationOtpHash = crypto.createHash('sha256').update(otp).digest('hex')
        user.verificationOtpExpires = new Date(Date.now() + 10 * 60 * 1000)
        await sendOtp(email, otp)
        await user.save()
        res.status(200).json({ message: 'Verification code sent', email })
    },
    forgotPassword: async (req, res) => {
        const email = req.body?.email?.trim().toLowerCase()

        if (!email) return res.status(400).json({ message: 'Email is required' })

        const user = await User.findOne({ email })
        if (!user) return res.status(200).json({ message: 'If the email exists, a reset code has been sent' })

        const otp = crypto.randomInt(100000, 1000000).toString()
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex')
        user.resetOtpHash = otpHash
        user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000)
        try {
            await sendResetOtp(email, otp)
            await user.save()
        } catch (error) {
            user.resetOtpHash = undefined
            user.resetOtpExpires = undefined
            await user.save()
            return res.status(503).json({ message: 'Unable to send reset email. Please try again later' })
        }

        res.status(200).json({ message: 'If the email exists, a reset code has been sent' })
    },
    resendResetPassword: async (req, res) => {
        const email = req.body?.email?.trim().toLowerCase()
        const user = email && await User.findOne({ email })

        if (!user) return res.status(200).json({ message: 'If the email exists, a reset code has been sent' })

        const otp = crypto.randomInt(100000, 1000000).toString()
        user.resetOtpHash = crypto.createHash('sha256').update(otp).digest('hex')
        user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000)
        try {
            await sendResetOtp(email, otp)
            await user.save()
        } catch (error) {
            return res.status(503).json({ message: 'Unable to send reset email. Please try again later' })
        }

        res.status(200).json({ message: 'If the email exists, a reset code has been sent' })
    },
    resetPassword: async (req, res) => {
        const { email, otp, password } = req.body || {}
        const normalizedEmail = email?.trim().toLowerCase()
        const normalizedOtp = otp?.toString().trim()
        const user = await User.findOne({ email: normalizedEmail })
        const otpHash = normalizedOtp && crypto.createHash('sha256').update(normalizedOtp).digest('hex')

        if (!user || !/^[0-9]{6}$/.test(normalizedOtp || '') || !password || password.length < 6 || !otpHash || user.resetOtpHash !== otpHash || !user.resetOtpExpires || user.resetOtpExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired reset code' })
        }

        user.password = await bcrypt.hash(password, 10)
        user.resetOtpHash = undefined
        user.resetOtpExpires = undefined
        await user.save()
        res.status(200).json({ message: 'Password reset successfully' })
    },
    changePassword: async (req, res) => {
        const { currentPassword, newPassword } = req.body || {}

        if (!currentPassword || !newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Current password and a new password of at least 6 characters are required' })
        }

        const user = await User.findById(req.user.id)
        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(401).json({ message: 'Current password is incorrect' })
        }

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()
        res.status(200).json({ message: 'Password changed successfully' })
    },
    updateProfile: async (req, res) => {
        const { name, username, email } = req.body || {}
        const updates = {}
        if (name?.trim()) updates.name = name.trim()
        if (username?.trim()) updates.username = username.trim()
        const normalizedEmail = email?.trim().toLowerCase()

        if (!Object.keys(updates).length && !normalizedEmail) return res.status(400).json({ message: 'Add a name, username, or email to update' })

        try {
            const user = await User.findById(req.user.id)
            if (!user) return res.status(404).json({ message: 'User not found' })

            Object.assign(user, updates)
            if (normalizedEmail && normalizedEmail !== user.email) {
                const emailInUse = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } })
                if (emailInUse) return res.status(409).json({ message: 'This email is already in use' })
                const emailOtp = crypto.randomInt(100000, 1000000).toString()
                user.pendingEmail = normalizedEmail
                user.emailVerified = false
                user.verificationOtpHash = crypto.createHash('sha256').update(emailOtp).digest('hex')
                user.verificationOtpExpires = new Date(Date.now() + 10 * 60 * 1000)
                await sendOtp(normalizedEmail, emailOtp)
                await user.save()
                return res.status(200).json({ message: 'Profile updated. Verify your new email.', email: normalizedEmail, requiresVerification: true })
            }

            await user.save()
            const safeUser = { _id: user._id, name: user.name, username: user.username, email: user.email, emailVerified: user.emailVerified }
            res.status(200).json({ message: 'Profile updated successfully', user: safeUser })
        } catch (error) {
            if (error.code === 11000) return res.status(409).json({ message: 'Username or email is already in use' })
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = userController