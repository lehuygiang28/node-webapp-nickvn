const { defineConfig } = require('cypress');
const mongo = require('cypress-mongodb');

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
            mongo.configurePlugin(on);
        },
        baseUrl: 'http://localhost:10023',
    },
    env: {
        mongodb: {
            uri: 'mongodb://127.0.0.1:27017/',
            // uri: 'mongodb+srv://giang_vtca:giangvtca2812@gianghuy.analwun.mongodb.net/', // Added the require statement for cypress-mongodb
            database: 'nodejs-nickvn-test', // Added the require statement for cypress-mongodb
        }, // Added the require statement for cypress-mongodb
    }, // Added the require statement for cypress-mongodb
});
