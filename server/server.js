require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');

const { Poem } = require('./models/poem');

const { User } = require('./models/user');

const { Response } = require('./models/response');

// const { authenticate } = require('./middleware/authenticate');

const  app = express();

const port = process.env.PORT;

//middleware bodyParser.json() evaluates to a function
app.use(bodyParser.json());

// POST A NEW POEM
app.post('/poems', (req, res) => {
  var newPoem = new Poem({
    title: req.body.title,
    message: req.body.message,
    location: req.body.location,
    authorId: new ObjectID()
  });

  newPoem.save().then((poem) => {
    res.send({poem});
  }, (e) => {
    res.status(400).send(e);
  });

});

// GET ALL POEMS 
app.get('/poems', (req, res) => {
  Poem.find({}).then((poems) => {
    res.send({poems})
  }, (e) => {
    res.status(400).send(e);
  });
});

//GET POEMS BY ID
app.get('/poems/:poemId', (req, res) => {
  var id = req.params.poemId;
  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }
  Poem.findOneAndUpdate({
    _id: id
  }, { $inc: { "stats.views" : 1 } }).then((poem) => {
    if(!poem){
      return res.status(404).send()
    }
    res.send({poem});
  }).catch((e) => {
    res.status(400).send(e)
  });

});

// UPDATE POEM 
app.patch('/poems/:poemId', async (req, res) => {
  let id = req.params.poemId;
  let updates = req.body;

  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }
  //IF REQ.BODY HAS RESPONSE, DEFINITELY YOU WANNA ADD RESPONSE
  if(updates.response){
    try{
      updates.createdAt = Date.now();
      updates.readerId = new ObjectID(); //authenticated id of user
      updates.poemId = id;
      const poem = await Poem.findOne({ _id: id});
      const response = await poem.addNewResponse(updates);
      res.send({poem});
    } catch (e){
      res.status(400).send(e)
    }
  }
  // ELSE YOU WANNA TRY SOMETHING ELSE LIKE EDITING POEM TITLE OR SO
  else{
    try{
      updates.updatedAt = Date.now();
      const poem = await Poem.findOneAndUpdate({ 
        _id: id,
        authorId: updates.authorId //authenticate update here...
      }, {$set: updates }, { new: true });
     
      res.send({poem});
    } catch (e){
      res.status(400).send(e)
    }
  }
  
});

//DELETE POEM BY ID
app.delete('/poems/:poemId', (req, res) => {
  var id = req.params.poemId;
  if(!ObjectID.isValid(id)){
    return res.status(404).send()
  }
  Poem.findOneAndRemove({
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

