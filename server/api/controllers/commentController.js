import db from './../models';
import { ObjectID } from 'mongodb';


const commentController = {};

commentController.post = async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;
  const poemId = req.params.poemId;

  var comment = new db.Comment({
    message,
    _creator: userId,
    _poem: poemId
  });

  try{
    const newComment = await comment.save();
    // if no newComment..
    if(!newComment){
      return res.status(500).json({
        message: "cannot create comment"
      });
    }
   
    //push this comment to an existing poem......
    const existingPoem = await db.Poem.findByIdAndUpdate({ _id: poemId}, {
      $push : { '_comments' : newComment.id }
    });
    const response = {
      success: true,
      comment: {
        ...newComment.toObject(),
        request: {
          type: 'GET',
          description: 'GET comment using url',
          url: `http://localhost:3000/api/comments/${newComment._id}`
        }
      }
    }
    if(existingPoem){
      return res.status(200).json(response);
    }
  }
  catch(err){
    res.status(400).json({
      message: err.message
    });
  }

}


commentController.postComment = async (req, res) => {
  const { message } = req.body;
  const userId = req.user._id;
  const poemId = req.params.poemId;
  const _parentId = req.params.commentId;


  var comment = new db.Comment({
    message,
    _creator: userId,
    _poem: poemId,
    _parentId
  });

  try{
    const newComment = await comment.save();
    // if no newComment..
    if(!newComment){
      return res.status(500).json({
        message: "cannot create comment"
      });
    }
   
    //push this comment to an existing poem......
    const existingComment = await db.Comment.findByIdAndUpdate({ _id: _parentId }, {
      $push : { '_comments' : newComment.id }
    });
    const response = {
      success: true,
      comment: {
        ...newComment.toObject(),
        request: {
          type: 'GET',
          description: 'GET comment using url',
          url: `http://localhost:3000/api/comments/${newComment._id}`
        }
      }
    }
    if(existingComment){
      return res.status(200).json(response);
    }
  }
  catch(err){
    res.status(400).json({
      message: err.message
    });
  }

}

commentController.getAll = (req, res) => {

  db.Comment.find({}).then((comments) => {
    const response = {
      success: true,
      count: comments.length,
      comments: comments.map((comment) => {
        return {
          ...comment.toObject(),
          request: {
            type: 'GET',
            description: 'GET comment using url',
            url: `http://localhost:3000/api/comments/${comment._id}`
          }
        }
      })
    }

    res.status(200).json(response);
  }, (err) => {
    res.status(400).json({
      message: err
    });
  });
}

commentController.getOne = (req, res) => {
  var id = req.params.commentId;
  if(!ObjectID.isValid(id)){
    return res.status(404).json({
      message: "no such comment"
    })
  }
  db.Comment.findOne({ _id: id, isDeleted: false })
  .then((comment) => {
    if(!comment){
      return res.status(404).json({
        message: "can't find comment"
      })
    }
    const response = {
      success: true,
      comment: {
        ...comment.toObject(),
        request: {
          type: 'GET',
          description: 'GET all comments',
          url: 'http://localhost:3000/api/comments'
        }
      }
    }
    res.status(200).json(response);
  }).catch((err) => {
    res.status(400).json({
      message: err.message
    })
  });
}

commentController.patch = async (req, res) => {
  let id = req.params.commentId;
  let updates = req.body;

  const userId = req.user._id;

  if(!ObjectID.isValid(id)){
    return res.status(404).json({
      message: "No such comment"
    })
  }
  
  try{
    updates.updatedAt = Date.now();
    const comment = await db.Comment.findOneAndUpdate({ 
      _id: id,
      _creator: userId,
      isDeleted: false
    }, { $set: updates }, { new: true });
    
    if(!comment){
      res.status(404).json({
        message: "Comment not found"
      }) 
    }
    const response = {
      success: true,
      comment: {
        ...comment.toObject(),
        request: {
          type: 'GET',
          description: 'GET poem using url',
          url: 'http://localhost:3000/api/comments' + id
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

commentController.delete = (req, res) => {
  const id = req.params.commentId;
  const userId = req.user._id;

  if(!ObjectID.isValid(id)){
    return res.status(404).json({
      message: "Invalid poem id"
    })
  }
  db.Comment.findOneAndUpdate({
    _id: id,
    _creator: userId,
    isDeleted: false
  }, { $set: { isDeleted: true }}).then((comment) => {
    if(!comment){
      return res.status(404).json({
        message: "No such comment"
      });
    }
    const response  = {
      success: true,
      comment: {
        ...comment.toObject(),
        request: {
          type: 'POST',
          description: 'You can create new comment on a poem with url',
          url: 'http://localhost:3000/api/poems/:poemId/comments',
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



export default commentController;