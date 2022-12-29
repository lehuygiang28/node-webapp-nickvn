const logger = require('node-color-log');
// Set date format to mm/dd/yyyy h/mm/ss
logger.setDate(() => (new Date()).toLocaleString().slice(0, 19).replace(/-/g, "/").replace("T", " "));

module.exports = { logger: logger }