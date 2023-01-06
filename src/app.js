const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('express-flash');
require('dotenv').config({ path: path.resolve(__dirname, `./config/env/${process.env.NODE_ENV}.env`) });
const favicon = require('serve-favicon');
const { sortMiddleware } = require('./app/middlewares/sortMiddleware');
const { renewUserSessionMiddleware } = require('./app/middlewares/renewUserSessionMiddleware');
const { customSessionFlashMiddleware } = require('./app/middlewares/customSessionFlashMiddleware');
const { getSessionToViewsMiddleware } = require('./app/middlewares/getSessionToViewsMiddleware');
const { paginationMiddleware } = require('./app/middlewares/paginationMiddleware');
const { changeLayoutMiddleware } = require('./app/middlewares/changeLayoutMiddleware');
const { formattedDate24h } = require('./util/formatDate');

const app = express();
const port = process.env.NODE_PORT || 8081;

const route = require('./routes/index.route');
const db = require('./config/db');
const { default: mongoose } = require('mongoose');

// Connect to mongodb
db.connect();

// Use favicon.ico
app.use(favicon(path.resolve(__dirname, 'public', 'favicon.ico')));

// Use static folder
app.use(express.static(path.resolve(__dirname, 'public')));

// Middleware 
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Express session
app.use(session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: true,
    saveUninitialized: false,
    store: db.getClientMongoStore(), // Store session to MongoDB collection/sessions
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // One week
    },
}));

// Midddleware Get session to handlebars 
app.use(getSessionToViewsMiddleware);

// Http logger
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    // app.use(morgan('combined'));
    // morgan(':date[clf] :method :url :status :res[content-length] - :response-time ms');
    morgan.token('date', (req, res) => {
        return formattedDate24h();
    });
    app.use(morgan(function(tokens, req, res) {
        return [
            tokens.date(req, res),
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
        ].join(' ');
    }));
}

// Flash express to send msg
app.use(flash());

// Template engine
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        helpers: require('./helpers/handlebars'),
        defaultLayout: 'main',
    })
);

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'resources', 'views'));
app.set('view layouts', path.resolve(__dirname, 'views', 'layouts'));


// --- CUSTOM MIDDLEWARES ---
// Custom flash middleware
app.use(customSessionFlashMiddleware);

// Sort
app.use(sortMiddleware);

// Renew User Session
app.use(renewUserSessionMiddleware);

// Pagination middleware
app.use(paginationMiddleware);

// Change layout middleware
app.use(changeLayoutMiddleware);

// --- CUSTOM MIDDLEWARES END ---

// Routes init
route(app);

// app.listen(port, () => {
//     console.log('\x1b[32m', `${formattedDate24h()} Server listening on port ${port}`, '\x1b[0m');
// });

module.exports = app;