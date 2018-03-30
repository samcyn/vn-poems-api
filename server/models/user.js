const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    minLength: 1,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  createdAt: {
    type: Date
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }],
  profile: {
    userName: {
      type: String,
      minLength:1
    },
    profilePic: {
      type: Object
    }
  },
  stats: {
    poemList:[]//,//Array of user poems
    // totalLikes: {
    //   type: Number,
    //   default: 0
    // },
    // totalViews: {
    //   type: Number,
    //   default: 0
    // },
  }
});


UserSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();
  // return _.pick(userObject, ['_id', 'email']);
  return user;
};

//instance methods here..
UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  // user.tokens.push({access, token});
  user.tokens = user.tokens.concat([{access , token }]);
  
  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function(token){
  var user = this;
  return user.update({
    $pull : {
      tokens : { token }
    }
  });
};

//MODEL METHODS
UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  }catch(e){
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject();
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function(email, password){
  var User = this;
  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject()
    }
    return new Promise((resolve, reject) => {
      //use bcrypt to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if(res){
          resolve(user)
        }
        else{
          reject();
        }
      });
    });

  });
}

//moogoose middleware used before saving doc
UserSchema.pre('save', function(next){
  var user = this;
  //we only wanna encrpt password if password is modified..
  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else{ 
    next() 
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = { User };