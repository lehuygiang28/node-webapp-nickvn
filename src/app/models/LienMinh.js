const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const LienMinhSchema = new Schema(
    {
        // _id: {type: mongoose.SchemaTypes.ObjectId},
        product_id: { type: Number, require: true },
        userName: { type: String, require: [true, 'UserName is required'] },
        password: { type: String, require: [true, 'Password is required'] },
        game: {
            id: { type: Number },
            name: { type: String, default: 'Liên Minh' },
        },
        price: { type: Number, default: 0 },
        champ: { type: Number, default: 0 },
        skin: { type: Number, default: 0 },
        rank: {
            type: String,
            require: [true, 'Rank must be selected'],
            enum: {
                values: [
                    'Chưa Rank',
                    'Sắt',
                    'Đồng',
                    'Bạc',
                    'Vàng',
                    'Bạch Kim',
                    'Kim Cương',
                    'Cao Thủ',
                    'Đại Cao Thủ',
                    'Thách Đấu',
                ],
                message: '{VALUE} is not supported',
            },
        },
        status_account: { type: String },
        note: { type: String, default: '' },
        status: {
            id: { type: Number, default: 1005 },
            name_en: { type: String, enum: ['sold', 'available'], default: 'available' },
            name_vi: { type: String, enum: ['đã bán', 'có sẵn'], default: 'có sẵn' },
        },
        status_id: { type: Number },
        status_name: { type: String },
        imgur: [
            {
                link: { type: String, required: [true, 'Img link should not be undefined'] },
                deletehash: {
                    type: String,
                    required: [true, 'Delete hash should not be undefined'],
                    default: 'localfile',
                },
            },
        ],
        visible: {
            type: String,
            enum: { values: ['show', 'hide'], message: '{VALUE} is not supported' },
            default: 'show',
        },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    },
    {
        product_id: false,
    },
);

LienMinhSchema.plugin(AutoIncrement, { inc_field: 'product_id' });

module.exports = mongoose.model('LienMinh', LienMinhSchema);
