const mongoose = require('mongoose');

const todoTaskSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },   
    content: { 
        type: String, 
        required: true},
    completed: {
        type: Boolean, 
        default: 0},
    date: { 
        type: Date, 
        default: Date.now}
})

module.exports = mongoose.model('TodoTask',todoTaskSchema);