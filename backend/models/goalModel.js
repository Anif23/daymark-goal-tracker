const mongoose = require('mongoose')

const goalSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    desc: {
        type: String,
        require: [true, 'Please add a description']
    },
    is_completed: {
        type: Boolean,
        default: false
    },
    mark_as_fav: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Goal', goalSchema)