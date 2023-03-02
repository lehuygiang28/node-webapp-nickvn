const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserPuchasedSchema = new Schema({
    user_id: { type: mongoose.Types.ObjectId, ref: 'User' },
    product_puchased: [
        {
            product: { type: [Schema.Types.ObjectId], ref: 'LienMinh' },
            created_at: { type: Date, default: new Date() },
        },
    ],
});

module.exports = mongoose.model('UserPuchased', UserPuchasedSchema);
