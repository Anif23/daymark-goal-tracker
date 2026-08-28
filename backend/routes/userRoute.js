const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')

const { login, register, logout, getMe, verifyEmail, resendVerification, requestVerification, forgotPassword, resendResetPassword, resetPassword, changePassword, updateProfile } = require('../controller/userController')

router.post('/login', login)
router.post('/register', register)
router.post('/logout', logout)
router.post('/verify-email', verifyEmail)
router.post('/resend-verification', resendVerification)
router.post('/request-verification', protect, requestVerification)
router.post('/forgot-password', forgotPassword)
router.post('/resend-reset-password', resendResetPassword)
router.post('/reset-password', resetPassword)
router.get('/me', protect, getMe)
router.patch('/change-password', protect, changePassword)
router.patch('/profile', protect, updateProfile)

module.exports = () => router