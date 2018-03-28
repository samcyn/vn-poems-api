require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');

const { Poem } = require('./models/poem');

const { User } = require('./models/user');

const { Comment } = require('./models/comment');

// const { authenticate } = require('./middleware/authenticate');

const  app = express();

const port = process.env.PORT;

//middleware bodyParser.json() evaluates to a function
app.use(bodyParser.json());


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };

