import db from './../models';
import { ObjectID } from 'mongodb';

const poemController = {};

poemController.post = (req, res) => {

  const { title, message } = req.body;
  const userId = req.user._id;

  var poem = new db.Poem({
    title,
    message,
    _creator: userId
  });

  poem.save().then((newPoem) => {
    if(newPoem){
      const response = {
        success: true,
        poem: {
          ...newPoem.toObject(),
          request: {
            type: 'GET',
            description: 'GET poem using url',
            url: `http://localhost:3000/api/poems/${newPoem._id}`
          }
        }
      }
      res.status(200).json(response);
    }
  }).catch( (err) => {
    res.status(400).json({
      message: err.message
    });
  });

}

poemController.getAll = (req, res) => {
  db.Poem.find({})
  .select('_id title message _comments isDeleted updatedAt createdAt')
  .populate({
    path: '_creator',
    select: 'username -_id'
  }).then((poems) => {
    const response = {
      success: true,
      count: poems.length,
      poems: poems.map((poem) => {
        return {
          ...poem.toObject(),
          request: {
            type: 'GET',
            description: 'GET poem using url',
            url: `http://localhost:3000/api/poems/${poem._id}`
          }
        }
      })
    }
    res.status(200).json(response);
  }).catch((err) => {
    res.status(400).json({
      message: err
    });
  })
}

poemController.getOne = async (req, res) => {

  var id = req.params.poemId;
  if(!ObjectID.isValid(id)){
    res.status(404).json({
      message: "no such poem"
    })
  }
  try{
    const poem = await db.Poem.findOne({ _id: id})
    .populate({
      path: '_creator',
      select: 'username -_id' 
    }).populate({
      path: '_comments',
      select: 'message _creator _poem _comments createdAt',
      match: { 'isDeleted' : false }
    });

    if(!poem){
      return res.status(404).json({
        message: "can't find poem"
      })
    }
    const response = {
      success: true,
      poem: {
        ...poem.toObject(),
        request: {
          type: 'GET',
          description: 'GET all poems',
          url: 'http://localhost:3000/api/poems'
        }
      }
    };

    res.status(200).json(response);

  } catch(err){
    res.status(400).json({
      message: err.message
    })
  }
}

poemController.patch = async (req, res) => {
  let id = req.params.poemId;
  let updates = req.body;

  const userId = req.user._id;

  if(!ObjectID.isValid(id)){
    return res.status(404).json({
      message: "No such poem"
    })
  }
  
  try{
    updates.updatedAt = Date.now();
    const poem = await db.Poem.findOneAndUpdate({ 
      _id: id,
      _creator: userId
    }, { $set: updates }, { new: true });
    
    if(!poem){
      res.status(404).json({
        message: "Poem not found"
      }) 
    }
    const response = {
      success: true,
      poem: {
        ...poem.toObject(),
        request: {
          type: 'GET',
          description: 'GET poem using url',
          url: 'http://localhost:3000/api/poems' + id
        }
      }
    }
    res.status(200).json(response);
  } catch (err){
    res.status(400).json({
      message: err.message
    })
  }
  
}

poemController.delete = (req, res) => {
  const id = req.params.poemId;
  const userId = req.user._id;

  if(!ObjectID.isValid(id)){
    return res.status(404).json({
      message: "Invalid poem id"
    })
  }
  db.Poem.findOneAndRemove({
    _id: id,
    _creator: userId
  }).then((poem) => {
    if(!poem){
      return res.status(404).json({
        message: "No such poem"
      });
    }
    const response  = {
      success: true,
      poem: {
        ...poem.toObject(),
        request: {
          type: 'POST',
          url: 'http://localhost:3000/api/poems',
          data: { title: 'String', message: 'String', _creator: 'ObjectID'}
        }
      }
    }
    res.status(200).json(response);
  }).catch((err) => {
    res.status(400).json({
      message: err.message
    });
  });
}


export default poemController;