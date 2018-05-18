import db from './../models';

const commentController = {};

commentController.post = (req, res) => {

  const { message, poemId } = req.body;
  const userId = req.user._id;

  var comment = new db.Comment({
    message,
    _creator: userId,
    _poem: poemId
  });

  comment.save().then((newComment) => {
    db.Poem.findByIdAndUpdate({ _id: poemId}, {
      $push : { '_comments' : newComment.id }
    }).then((existingPoem) => {
      res.status(200).json({
        success: true,
        data: newComment,
        existingPoem
      })
    })
  }).catch((err) => {
    res.status(400).json({
      message: err.message
    });
  });

}

// commentController.getAll = (req, res) => {
//   db.Poem.find({}).populate({
//     path: '_creator',
//     select: 'username -_id'
//   }).then((poems) => {
//     res.status(200).json({
//       success: true,
//       data: poems
//     })
//   }, (err) => {
//     res.status(400).json({
//       message: err
//     });
//   });
// }

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