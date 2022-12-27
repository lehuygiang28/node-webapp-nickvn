const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LienMinh = new Schema({
    product_id: {type: Number, minLength: 1},
    userName: {type: String, minLength: 1},
    password: {type: String, minLength: 1},
    price: {type: Number, min: 0},
    champ: {type: Number, min: 0},
    skin: {type: Number, min: 0},
    rank: {type: String, minLength: 1},
    status_account: {type: String, minLength: 1},
    note: {type: String, minLength: 0},
    status_id: {type: Number, minLength: 1},
    status_name: {type: String, minLength: 1},
    img: {type: Array, minLength: 1}
});


module.exports = mongoose.model('LienMinh', LienMinh);