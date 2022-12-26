const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserPuchased = new Schema({
    user_id: {type: mongoose.Types.ObjectId, required: true},
    product_puchased: {type: Array, required: true}
});

module.exports = mongoose.model('UserPuchased', UserPuchased);