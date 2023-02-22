const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: { type: mongoose.Types.ObjectId, default: mongoose.Types.ObjectId },
    userName: {
        type: String,
        required: [true, 'UserName is required'],
        unique: [true, 'UserName is unique'],
    },
    password: { type: String, required: [true, 'Password is required'] },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email is unique'],
    },
    phone: { type: String, unique: [true, 'Phone Number is unique'] },
    fullName: { type: String, maxLength: 255 },
    money: { type: Number, default: 0 },
    role: {
        role_id: { type: Number, default: 3 },
        role_name_vi: { type: String, default: 'Thành Viên' },
        role_name_en: { type: String, default: 'Member' },
    },
    status: { type: String, enum: { values: ['active', 'ban'], message: '{VALUES} is not supported' }, default: 'active' },
    avatar: { type: String, default: 'https://i.imgur.com/uZR1t5V.jpg' },
    note: { type: String, default: 'No comment!' },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    lastLogin: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('User', UserSchema);
