const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add your name'],
        trim: true,
    },
    username: {
        type: String,
        required: [true, 'Please add a name'],
        unique: [true, 'This username is already taken, please use another username'],
        index: true,
    },
    email: {
        type: String,
        required: [true, 'Please add a email'],
        unique: [true, 'This email is already taken, please use other email'],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    emailVerified: { type: Boolean, default: false },
    verificationOtpHash: String,
    verificationOtpExpires: Date,
    pendingEmail: String,
    resetOtpHash: String,
    resetOtpExpires: Date,
});

module.exports = mongoose.model('User', userSchema);