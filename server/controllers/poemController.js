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
    res.status(200).json({
      success: true,
      data: newPoem
    });
  }, (err) => {
    res.status(400).json({
      message: err.message
    });
  });

}

poemController.getAll = (req, res) => {
  db.Poem.find({}).populate({
    path: '_creator',
    select: 'username -_id'
  }).then((poems) => {
    res.status(200).json({
      success: true,
      data: poems
    })
  }, (err) => {
    res.status(400).json({
      message: err
    });
  });
}

poemController.getOne = (req, res) => {
  var id = req.params.poemId;
  if(!ObjectID.isValid(id)){
    return res.status(404).json({
      message: "no such poem"
    })
  }
  db.Poem.findOne({ _id: id}).populate({
    path: '_creator',
    select: 'username -_id'
  }).populate({
    path: '_comments',
    select: 'message _creator _poem createdAt',
    match: { 'isDeleted' : false }
  })
  .then((poem) => {
    if(!poem){
      return res.status(404).json({
        message: "can't find poem"
      })
    }
    res.status(200).json({
      success: true,
      data: poem
    });
  }).catch((err) => {
    res.status(400).json({
      message: err.message
    })
  });
}

poemController.patch = async (req, res) => {
  let id = req.params.poemId;
  let updates = req.body;

  const userId = req.user._id;

  if(!ObjectID.isValid(id)){
    return res.status(404).json({
      message: "unauthorized access"
    })
  }
  
  try{
    updates.updatedAt = Date.now();
    const poem = await db.Poem.findOneAndUpdate({ 
      _id: id,
      _creator: userId
    }, { $set: updates }, { new: true });
    
    res.status(200).json({
      success: true, 
      data: poem
    });
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
    res.status(200).json({
      success: true,
      data: poem
    });
  }).catch((err) => {
    res.status(400).json({
      message: err.message
    });
  });
}


export default poemController;