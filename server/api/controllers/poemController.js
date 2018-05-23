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
  db.Poem.find({isDeleted: false})
  .select('_id title message _comments isDeleted updatedAt createdAt')
  .then((poems) => {
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
    const poem = await db.Poem.findOne({ _id: id, isDeleted: false });
    //deepPopulate('_comments _creator _comments._comments _comments._creator');

    if(!poem){
      return res.status(404).json({
        message: "poem not found"
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

poemController.put = async(req, res) => {
  let poemId = req.params.poemId;

  const userId = req.user._id;

  if(!ObjectID.isValid(poemId)){
    return res.status(404).json({
      message: "No such poem"
    })
  }
  
  try{
    const poem = await db.Poem.findOne({ 
      _id: poemId
    });
    
    if(!poem){
      res.status(404).json({
        message: "Poem not found"
      }) 
    }
    
    if(poem.upVotes.indexOf(userId) === -1){
      poem.voteScore += 1;
      poem.upVotes.push(userId);
      poem.downVotes.splice(poem.downVotes.indexOf(userId), 1);      
      const updatedPoem = await poem.save();
  
      if(!updatedPoem){
        res.status(401).json({ message : "can't add vote"});
      }
  
      const response = {
        success: true,
        poem: {
          ...updatedPoem.toObject(),
          request: {
            type: 'GET',
            description: 'GET poem detail using url',
            url: 'http://localhost:3000/api/poems' + poemId
          }
        }
      }
      res.status(200).json(response);
    }
    else{
      res.status(401).json({
        message: "You can't vote twice"
      });
    }
  } catch (err){
    res.status(400).json({
      message: err.message
    })
  }
}


poemController.putDownVote = async(req, res) => {
  let poemId = req.params.poemId;

  const userId = req.user._id;

  if(!ObjectID.isValid(poemId)){
    return res.status(404).json({
      message: "No such poem"
    })
  }
  
  try{
    const poem = await db.Poem.findOne({ 
      _id: poemId
    });
    
    if(!poem){
      res.status(404).json({
        message: "Poem not found"
      }) 
    }
    
    if(poem.downVotes.indexOf(userId) === -1){
      
      if(poem.voteScore === 0){
        poem.voteScore = 0;
      }
      else{
        poem.voteScore -= 1;
      }
      poem.downVotes.push(userId);
      poem.upVotes.splice(poem.upVotes.indexOf(userId), 1);
      const updatedPoem = await poem.save();
  
      if(!updatedPoem){
        res.status(401).json({ message : "can't add vote"});
      }
  
      const response = {
        success: true,
        poem: {
          ...updatedPoem.toObject(),
          request: {
            type: 'GET',
            description: 'GET poem detail using url',
            url: 'http://localhost:3000/api/poems' + poemId
          }
        }
      }
      res.status(200).json(response);
    }
    else{
      res.status(401).json({
        message: "You can't downvote twice"
      });
    }
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
  db.Poem.findOneAndUpdate({
    _id: id,
    _creator: userId,
    isDeleted: false
  }, { $set: { isDeleted: true }}).then((poem) => {
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
          description: 'You can create new poem with url',
          url: 'http://localhost:3000/api/poems',
          data: { title: 'String', message: 'String', _creator: 'String'}
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