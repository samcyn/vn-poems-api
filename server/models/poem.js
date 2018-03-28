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
  author:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  location:{
    type: String,
    required: true
  },
  stats: {
    reponses: [{
      readerId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      message: {
        type: String
      },
      createdAt: {
        type: Number,
        default: null
      }
    }],
    likes: {
      type: Number,
      default: 0
    }
  }

});

//before saving new instances updated the createdAt value
PoemSchema.pre('save', function(next) {
  var poem = this;
  poem.createdAt = Date.now();
  next();
});

var Poem = mongoose.model('Poem', PoemSchema);

module.exports = { Poem };