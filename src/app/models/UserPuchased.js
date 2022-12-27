const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserPuchased = new Schema({
    user_id: { type: mongoose.Types.ObjectId, required: true },
    product_puchased: [{
        _id: { type: mongoose.Types.ObjectId, default: mongoose.Types.ObjectId },
        product_obj_id: { type: mongoose.Types.ObjectId, required: true },
        product_id: { type: Number, required: true },
        price: { type: Number, required: true },
        created_at: { type: Date, default: Date.now() }
    }]
});

module.exports = mongoose.model('UserPuchased', UserPuchased);