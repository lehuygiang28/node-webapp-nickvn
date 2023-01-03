const siteRouter = require('./site.route');
const lienMinhsRouter = require('./lien-minh.route');
const userRouter = require('./user.route');

function route(app) {

    app.use('/user', userRouter);
    app.use('/lien-minh', lienMinhsRouter);
    app.use('/', siteRouter);
    
}

module.exports = route;
