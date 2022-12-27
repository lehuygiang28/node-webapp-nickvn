const logger = require('node-color-log');
// Set date format to 
logger.setDate(() => (new Date()).toLocaleString().slice(0, 19).replace(/-/g, "/").replace("T", " "));

module.exports = {logger}