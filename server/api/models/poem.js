import mongoose from 'mongoose';

const { Schema } = mongoose;

const PoemSchema = new Schema({
  title : {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  message: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Number,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  _creator:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  _comments : [{ type: Schema.Types.ObjectId, ref: 'Comment'}]
});

//instance methods here..
PoemSchema.methods.addNewResponse = function(arg){
  const poem = this;
  
  poem.stats.responses = poem.stats.responses.concat([arg]);

  return poem.save().then(() => {
    return arg;
  });
};



const Poem = mongoose.model('Poem', PoemSchema);

export default Poem;