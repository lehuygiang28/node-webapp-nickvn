const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    userName: {type: String, minLength: 8},
    password: {type: String, minLength: 8},
    fullName: {type: String, maxLength: 255},
    money: {type: Number, default: 0},
    role: {type: String, default: 'member'},
    status: {type: String, default: 'active'},
    avatar: String,
    note: String,
    createAt: {type: Date, default: Date.now},
    updateAt: {type: Date, default: Date.now},
    lastLogin: {type: Date, default: Date.now},
});


module.exports = mongoose.model('User', User);