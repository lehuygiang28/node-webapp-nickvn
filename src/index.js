const path = require('path');
const express = require('express');
const handlebars = require('express-handlebars');
const morgan = require('morgan');

const app = express();
const port = 8080;

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
app.set('views', path.join(__dirname, 'resources/views'));

app.get("/", (_req, res) => {
    res.render("home");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
