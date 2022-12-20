const mongoose = require('mongoose');

async function connect() {

  // mongodb://localhost:27017/nodejs-nickvn
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect('mongodb://127.0.0.1:27017/nodejs-nickvn');
    console.log('Connect success');

  } catch (error) {
    console.log('Connect Failed');
  }
}

module.exports = { connect };