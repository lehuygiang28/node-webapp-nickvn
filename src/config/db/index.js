const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../config.env') });

async function connect() {

  // mongodb://localhost:27017/nodejs-nickvn
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.MONGOURL,{useNewUrlParser:true, useUnifiedTopology: true });
    console.log('Connect mongodb success');

  } catch (error) {
    console.log('Connect mongodb Failed');
  }
}

module.exports = { connect };