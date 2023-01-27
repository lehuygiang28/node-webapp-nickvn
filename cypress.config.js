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
            database: 'nodejs-nickvn-test',
        },
    },
});
