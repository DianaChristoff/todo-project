const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
user: {
    type: String,
    required: true
},
gratitude: {
    type: String
},
achievement: {
    type: String,
    },
date: {
    type: Date,
    required:true,
    default: Date.now
}
})

module.exports = mongoose.model('Entry', entrySchema);