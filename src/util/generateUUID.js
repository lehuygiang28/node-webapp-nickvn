const { v4: uuidv4 } = require('uuid');

function createUUID(data) {
    return `${uuidv4(data)}`;
}

function createUUIDFile(filename) {
    return `${uuidv4(filename)}.${getExtensions(filename)}`;
}

function createUUIDWithFileExtension(data, extension) {
    return `${uuidv4(data)}.${extension}`;
}

function getExtensions(filename) {
    return filename
        .split('.')
        .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
        .slice(1)
        .join('.');
}

module.exports = {
    createUUID,
    createUUIDFile,
    createUUIDWithFileExtension,
};
