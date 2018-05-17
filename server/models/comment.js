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
  }

});


function autoPopulateUser(next){
  this.populate({
    path: '_creator',
    select: 'username -_id'
  });
  next();
}

CommentSchema.pre('find', autoPopulateUser);

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;