var mongoose = require('mongoose');

var PoemSchema = new mongoose.Schema({
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
    type: Date
  },
  updatedAt: {
    type: Number,
    default: null
  },
  authorId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  location:{
    type: String,
    required: true
  },
  stats: {
    responses: [{
      readerId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      poemId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      response: {
        type: String
      },
      createdAt: {
        type: Number,
        default: null
      }
    }],
    likes: {
      type: Array
    },
    views: {
      type: Number,
      default: 0
    }
  }

});

//instance methods here..
PoemSchema.methods.addNewResponse = function(arg){
  const poem = this;
  
  poem.stats.responses = poem.stats.responses.concat([arg]);

  return poem.save().then(() => {
    return arg;
  });
};

//before saving new instances updated the createdAt value
PoemSchema.pre('save', function(next) {
  var poem = this;

  if(poem.isModified('stats.responses') || poem.isModified('stats.likes') || poem.isModified('stats.views')){
    console.log('Yes');
  } else{
    poem.createdAt = Date.now();
  }
 
  next();
});

var Poem = mongoose.model('Poem', PoemSchema);

module.exports = { Poem };