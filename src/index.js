const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const morgan = require('morgan');

const app = express();
const port = 8081;

const route = require('./routes')
const db = require('./config/db')

// Connect to mongodb
db.connect();

app.use(express.static('src\\public'));

// Middleware
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

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
