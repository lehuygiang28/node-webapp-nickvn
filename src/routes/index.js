const lienMinhsRouter = require('./lien-minh');
const siteRouter = require('./site');

function route(app) {

    app.use('/lien-minh', lienMinhsRouter);
    app.use('/', siteRouter);
    
}

module.exports = route;
