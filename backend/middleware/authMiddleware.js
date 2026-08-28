const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select('-password')

            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not authorized')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
}

module.exports = protect

const requireVerifiedEmail = (req, res, next) => {
    if (!req.user?.emailVerified) {
        return res.status(403).json({ message: 'Please verify your email from your profile before using goals' })
    }

    next()
}

module.exports.requireVerifiedEmail = requireVerifiedEmail