const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const LienMinhSchema = new Schema(
    {
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
        status: {
            id: { type: Number, default: 1005 },
            name_en: { type: String, enum: ['sold', 'available'], default: 'available' },
            name_vi: { type: String, enum: ['đã bán', 'có sẵn'], default: 'có sẵn' },
        },
        status_id: { type: Number, minLength: 1 },
        status_name: { type: String, minLength: 1 },
        img: { type: Array, minLength: 1 },
        visible: { type: String, enum: ['show', 'hide'], default: 'show' },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    },
    {
        product_id: false,
    },
);

LienMinhSchema.plugin(AutoIncrement, { inc_field: 'product_id' });
module.exports = mongoose.model('LienMinh', LienMinhSchema);
