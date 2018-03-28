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
  var newPoem = new Poem({
    title: req.body.title,
    message: req.body.message,
    location: req.body.location,
    author: new ObjectID()
  });

  newPoem.save().then((poem) => {
    res.send({poem});
  }, (e) => {
    res.status(400).send(e);
  });

});

app.get('/poems', (req, res) => {
  Poem.find({}).then((poems) => {
    res.send({poems})
  }, (e) => {
    res.status(400).send(e);
  });
});


app.get('/poems/:poemId', (req, res) => {
  var id = req.params.poemId;
  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }
  Poem.findOne({
    _id: id
  }).then((poem) => {
    if(!poem){
      return res.status(404).send()
    }
    res.send({poem});
  }).catch((e) => {
    res.status(400).send(e)
  });

});



app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };

