// test/test_helper.js

const mongoose = require('mongoose');

// tells mongoose to use ES6 implementation of promises
mongoose.Promise = global.Promise;
const MONGODB_URI = process.env.MONGOURL_TEST || 'mongodb://127.0.0.1:27017/nodejs-nickvn-test';
mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI);

mongoose.connection
    .once('open', () => console.log('Mongodb test connected!'))
    .on('error', (error) => {
        console.warn('Mongodb test connect error : ', error);
    });