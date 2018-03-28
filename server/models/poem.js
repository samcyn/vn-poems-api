var mongoose = require('mongoose');

var Poem = mongoose.model('Poem', {
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
    type: Number,
    default: null
  },
  author:{
    type: mongoose.Schema.Types.ObjectId,
    require: true
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


module.exports = { Poem };