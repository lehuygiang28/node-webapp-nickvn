const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    categoryName: { type: String, minLength: 1 },
    total: { type: Number },
    img: { type: String, minLength: 1 },
    slug: { type: String, minLength: 1 },
    categories: { type: Array },
});

module.exports = mongoose.model('Category', CategorySchema);
