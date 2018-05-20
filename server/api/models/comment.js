import mongoose from 'mongoose';

const { Schema } = mongoose;

var CommentSchema = Schema({
  message: {
    type: String
  },
  createdAt: {
    type: Number,
    default: Date.now()
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  _creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  _poem: {
    type: Schema.Types.ObjectId,
    ref: 'Poem',
    required: true
  },
  _parentId: {
    type: Schema.Types.ObjectId,
    default: null
  },
  _comments : [{ type: Schema.Types.ObjectId, ref: 'Comment'}]  

});


function autoPopulateUser(next){
  this.populate({
    path: '_creator',
    select: 'username -_id'
  });
  this.populate({
    path: '_comments',
    select: '_id message _creator _poem _comments _parentId createdAt isDeleted',
    match: { 'isDeleted' : false },
    populate: [
      {
        path: '_creator',
        select: 'username -_id'
      },
      {
        path: '_comments',
        select: 'message _creator _poem _comments createdAt isDeleted',
        match: { 'isDeleted' : false },
        populate: [
          {
            path: '_creator',
            select: 'username -_id'
          },
          {
            path: '_comments',
            select: 'message _creator _poem _comments createdAt isDeleted',
            match: { 'isDeleted' : false },
            populate: [
              {
                path: '_creator',
                select: 'username -_id'
              },
              {
                path: '_comments',
                select: 'message _creator _poem _comments createdAt isDeleted',
                match: { 'isDeleted' : false }
              }
            ]
          }
        ]
      }
    ]
  });
  next();
}

CommentSchema.pre('findOne', autoPopulateUser);

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;