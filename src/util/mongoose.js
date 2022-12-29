/***
 * Mapping an array to unlock the mongoose object
 * @param {Array} mongooseArrays An array of mongoose query results
 * 
 */
function mutipleMongooseToObject(mongooseArrays) {
    return mongooseArrays.map(mongooseArrays => mongooseArrays.toObject());
}

/***
 * Return an object to unlock the mongoose object
 * @param {Object} mongoose An object of mongoose query results
 * 
 */
function mongooseToObject(mongoose) {
    return mongoose ? mongoose.toObject() : mongoose;
}

module.exports = {
    mutipleMongooseToObject,
    mongooseToObject
};