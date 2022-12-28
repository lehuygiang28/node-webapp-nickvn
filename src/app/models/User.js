const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    _id: { type: mongoose.Types.ObjectId },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    fullName: { type: String, maxLength: 255 },
    money: { type: Number, default: 0 },
    role: {
        type: Object,
        default: {
            role_id: 3,
            role_name_vi: 'Thành viên',
            role_name_en: 'Member'
        }
    },
    status: { type: String, default: 'active' },
    avatar: String,
    note: String,
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
    lastLogin: { type: Date, default: Date.now() },
});


module.exports = mongoose.model('User', User);