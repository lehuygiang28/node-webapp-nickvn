const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('express-flash');
require('dotenv').config({ path: path.resolve(__dirname, './config/env/.env') });
const favicon = require('serve-favicon');
const { sortMiddleware } = require('./app/middlewares/sortMiddleware');
const { renewUserSessionMiddleware } = require('./app/middlewares/renewUserSessionMiddleware');
const { customSessionFlashMiddleware } = require('./app/middlewares/customSessionFlashMiddleware');
const { getSessionToViewsMiddleware } = require('./app/middlewares/getSessionToViewsMiddleware');

const app = express();
const port = process.env.NODE_PORT || 8081;
// const port = 8081;

const route = require('./routes');
const db = require('./config/db');

// Connect to mongodb
db.connect();

// Use favicon.ico
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

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
app.use(getSessionToViewsMiddleware);

// Http logger
app.use(morgan('combined'));

// Flash express to send msg
app.use(flash());

// --- CUSTOM MIDDLEWARES ---
// Custom flash middleware
app.use(customSessionFlashMiddleware);
// Sort
app.use(sortMiddleware);
// Renew User Session
app.use(renewUserSessionMiddleware);
// --- CUSTOM MIDDLEWARES END ---

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