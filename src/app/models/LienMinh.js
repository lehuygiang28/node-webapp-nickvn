const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const LienMinhSchema = new Schema({
    // _id: {type: mongoose.SchemaTypes.ObjectId},
    product_id: { type: Number, require: true },
    userName: { type: String, minLength: 1 },
    password: { type: String, minLength: 1 },
    game: {
        id: { type: Number, require: true },
        name: { type: String, default: 'Liên Minh' },
    },
    price: { type: Number, min: 0 },
    champ: { type: Number, min: 0 },
    skin: { type: Number, min: 0 },
    rank: { type: String, minLength: 1 },
    status_account: { type: String, minLength: 1 },
    note: { type: String, minLength: 0 },
    status_id: { type: Number, minLength: 1 },
    status_name: { type: String, minLength: 1 },
    img: { type: Array, minLength: 1 }
}, {
    product_id: false
});

LienMinhSchema.plugin(AutoIncrement, { inc_field: 'product_id' });
module.exports = mongoose.model('LienMinh', LienMinhSchema);