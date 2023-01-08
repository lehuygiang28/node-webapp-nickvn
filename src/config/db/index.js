const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const path = require('path');

/***
 * Connect to MongoDB
 * @module connect
 */
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
    await mongoose
        .connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Connect mongodb successful!');
        })
        .catch((err) => {
            console.log('Connect mongodb error: ' + err);
        });
}

/***
 * Return a client MongoStore to store sessions in MongoDB
 *
 * @module getClientMongoStore
 * @returns A client mongo store
 */
function getClientMongoStore() {
    return MongoStore.create({
        // clientPromise,
        mongoUrl: process.env.MONGOURL,
        ttl: 60 * 60 * 24 * 3, // 3 days
    });
}

function createConnection() {
    return mongoose.createConnection(process.env.MONGOURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

module.exports = { connect, getClientMongoStore, createConnection };
