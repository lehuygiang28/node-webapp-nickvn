const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category_name: { type: String, require: true },
    total: { type: Number, default: 0 },
    img: { type: String, require: true },
    slug: { type: String, require: true },
    categories: [
        {
            category_name: { type: String, require: true },
            total: { type: Number, default: 0 },
            img: { type: String, require: true },
            slug: { type: String, require: true },
            visible: { type: String, enum: ['show', 'hide'], default: 'show' },
        },
    ],
    visible: { type: String, enum: ['show', 'hide'], default: 'show' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Category', CategorySchema);
