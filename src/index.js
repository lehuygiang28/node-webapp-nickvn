const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('express-flash');
require('dotenv').config({ path: path.resolve(__dirname, './config/env/.env') });
const sortMiddleware = require('./app/middlewares/sortMiddleware');


const app = express();
const port = process.env.NODE_PORT || 8081;
// const port = 8081;

const route = require('./routes');
const db = require('./config/db');

// Connect to mongodb
db.connect();

// Use static folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware 
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Express session
app.use(session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: true,
    saveUninitialized: false
}));

// Midddleware Get session to handlebars 
app.use(function(_req, res, next) {
    res.locals.session = _req.session;
    next();
});

// Http logger
app.use(morgan('combined'));

// CUSTOM MIDDLEWARES
// Flash express to send msg by redirect
app.use(flash());
// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(_req, res, next) {
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = _req.session.sessionFlash;
    delete _req.session.sessionFlash;
    next();
});
// Sort
app.use(sortMiddleware);

// Template engine
app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        helpers: require('./helpers/handlebars'),
    })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes init
route(app);

app.listen(port, () => {
    const nowDate = (new Date()).toLocaleString().slice(0, 19).replace(/-/g, "/").replace("T", " ");
    console.log('\x1b[32m', `[${nowDate}] Server listening on port ${port}`, '\x1b[0m');
});