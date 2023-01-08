const siteRouter = require('./site.route');
const lienMinhsRouter = require('./lien-minh.route');
const userRouter = require('./user.route');
const adminRouter = require('./admin.route');

function route(app) {
    app.use('/admin', adminRouter);
    app.use('/user', userRouter);
    app.use('/lien-minh', lienMinhsRouter);
    app.use('/', siteRouter);
    app.use('*', function (req, res, next) {
        res.status(404).render('error/error', {
            layout: false,
            error: {
                code: 404,
                title: 'Page Not Found',
                message:
                    'We’re sorry, the page you have looked for does not exist in our website! Maybe go to our home page or try to use a search ?',
            },
        });
    });
}

module.exports = route;
