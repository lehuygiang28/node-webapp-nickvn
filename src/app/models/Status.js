const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Status = new Schema({
    status_id: {type: Number, required: true},
    status_name_vi: {type: string},
    status_name_en: {type: string}
});

module.exports = mongoose.model('Status', Status);