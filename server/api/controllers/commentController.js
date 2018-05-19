import db from './../models';

const commentController = {};

commentController.post = async (req, res) => {

  const { message, poemId, _parentId } = req.body;
  const userId = req.user._id;

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
    // if comment has a parentId push this comment to the comment array of its parent 
    if(newComment._parentId){
      const existingComment = await db.Comment.findByIdAndUpdate({_id: _parentId}, {
        $push : { '_comments' : newComment.id }
      });
      if(!existingComment){
        return res.status(500).json({
          message: "cannot create comment"
        });
      }
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
      return res.status(200).json(response);
    }
    //else push this comment to an existing poem......
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
  // comment.save().then((newComment) => {
  //   if(!newComment){
  //     res.status(500).json({
  //       message: "cannot create comment"
  //     });
  //   }
  //   else{
  //     if(newComment._parentId){
  //       db.Comment.findOneAndUpdate({_id: _parentId})
  //       .then((existingComment) => {
  //         res.status(200).json({
  //           success: true,
  //           data: newComment,
  //           existingComment 
  //         })
  //       })
  //     }
  //     db.Poem.findByIdAndUpdate({ _id: poemId}, {
  //       $push : { '_comments' : newComment.id }
  //     }).then((existingPoem) => {
  //       res.status(200).json({
  //         success: true,
  //         data: newComment,
  //         existingPoem
  //       })
  //     })
  //   }
  // }).catch((err) => {
  //   res.status(400).json({
  //     message: err.message
  //   });
  // });

}

commentController.getAll = (req, res) => {

  db.Comment.find({}).then((comments) => {
    res.status(200).json({
      success: true,
      data: comments
    })
  }, (err) => {
    res.status(400).json({
      message: err
    });
  });
}

// commentController.getOne = (req, res) => {
//   var id = req.params.poemId;
//   if(!ObjectID.isValid(id)){
//     return res.status(404).json({
//       message: "no such poem"
//     })
//   }
//   db.Poem.findOne({ _id: id}).populate({
//     path: '_creator',
//     select: 'username -_id'
//   }).then((poem) => {
//     if(!poem){
//       return res.status(404).json({
//         message: "can't find poem"
//       })
//     }
//     res.status(200).json({
//       success: true,
//       data: poem
//     });
//   }).catch((err) => {
//     res.status(400).json({
//       message: err.message
//     })
//   });
// }

// commentController.patch = async (req, res) => {
//   let id = req.params.poemId;
//   let updates = req.body;

//   if(!ObjectID.isValid(id)){
//     return res.status(404).json({
//       message: "unauthorized access"
//     })
//   }
  
//   try{
//     updates.updatedAt = Date.now();
//     const poem = await db.Poem.findOneAndUpdate({ 
//       _id: id
//     }, { $set: updates }, { new: true });
    
//     res.status(200).json({
//       success: true, 
//       data: poem
//     });
//   } catch (err){
//     res.status(400).json({
//       message: err.message
//     })
//   }
  
  
// }

// commentController.delete = (req, res) => {
//   const id = req.params.poemId;
//   if(!ObjectID.isValid(id)){
//     return res.status(404).json({
//       message: "Invalid poem id"
//     })
//   }
//   db.Poem.findOneAndRemove({
//     _id: id
//   }).then((poem) => {
//     if(!poem){
//       return res.status(404).json({
//         message: "No such poem"
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: poem
//     });
//   }).catch((err) => {
//     res.status(400).json({
//       message: err.message
//     });
//   });
// }


export default commentController;