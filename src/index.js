const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const morgan = require('morgan');
const session = require('express-session');
require('dotenv').config({ path: path.resolve(__dirname, './config.env') });


const app = express();
const port = process.env.NODE_PORT || 3000;
// const port = 8081;

const route = require('./routes');
const db = require('./config/db');

// Connect to mongodb
db.connect();

app.use(express.static('src\\public'));

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

// Get session to handlebars
app.use(function(_req, res, next) {
  res.locals.session = _req.session;
  next();
});

// Http logger
app.use(morgan('combined'));

// Template engine
app.engine(
    "hbs",
    handlebars.engine({
      extname: ".hbs",
    })
  );

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes init
route(app);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
