const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../env/.env') });

async function connect() {
  // mongodb://localhost:27017/nodejs-nickvn
  // try {
  //   mongoose.set('strictQuery', false);
  //   await mongoose.connect(process.env.MONGOURL,{useNewUrlParser:true, useUnifiedTopology: true });
  //   console.log('Connect mongodb success');

  // } catch (error) {
  //   console.log('Connect mongodb Failed');
  // }

  mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.MONGOURL,{useNewUrlParser:true, useUnifiedTopology: true })
    .then(() => {console.log('Connect mongodb successful!')})
    .catch(err => {console.log('Connect mongodb error: ' + err)});
    
}

function getClient() {
  return mongoose.connection.getClient();
}

module.exports = { connect, getClient };