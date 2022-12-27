const siteRouter = require('./site');
const lienMinhsRouter = require('./lien-minh');
const userRouter = require('./user');

function route(app) {

    app.use('/user', userRouter);
    app.use('/lien-minh', lienMinhsRouter);
    app.use('/', siteRouter);
    
}

module.exports = route;
