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

app.post('/poems', (req, res) => {
  var poem = new Poem({
    title: req.body.title,
    message: req.body.message,
    author: new ObjectID()
  });

  poem.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };

