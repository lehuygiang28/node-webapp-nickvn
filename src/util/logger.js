const logger = require('node-color-log');
const { formattedDate24h } = require('./formatDate');

// Set date format to mm/dd/yyyy h/mm/ss
logger.setDate(() => formattedDate24h());

if (process.env.NODE_ENV === 'test') {
    logger.setLevel('disable');
}

module.exports = { logger: logger };
