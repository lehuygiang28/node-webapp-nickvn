const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var LienMinh = require('./LienMinh');

const UserPuchasedSchema = new Schema({
    user_id: { type: mongoose.Types.ObjectId, required: true },
    product_puchased: [
        {
            _id: { type: mongoose.Types.ObjectId },
            // product_obj_id: { type: mongoose.Types.ObjectId, required: true },
            // product_id: { type: Number, required: true },
            // product_name: {type: String, required: true},
            // price: { type: Number, required: true },
            product: { type: [Schema.Types.ObjectId], ref: 'LienMinh' },
            created_at: { type: Date, default: Date.now() },
        },
    ],
});

module.exports = mongoose.model('UserPuchased', UserPuchasedSchema);
