import mongoose from 'mongoose';

const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

var UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
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
    type: Date,
    default: Date.now()
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
    type: Object
  },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number },
  isDeleted: {
    type: Boolean,
    default: false
  }
});


//instance methods here..
UserSchema.methods.generateAuthToken = function(){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();
  // user.tokens.push({access, token});
  user.tokens = user.tokens.concat([{ access , token }]);
  
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
    return Promise.reject({ message: "Unauthorized request "});
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth' 
  });
};

UserSchema.statics.findByCredentials = function(email, password){
  var User = this;
  return User.findOne({ email }).then((user) => {

    return new Promise((resolve, reject) => {
      
      if(!user){
        reject({ message: reasons.NOT_FOUND })
      }

      if(user.isLocked){
        return user.incLoginAttempts(function(err) {
          if (err) {
            reject({ message: err.message })
          };
          reject({message: reasons.MAX_ATTEMPTS});
        });
      }

      //use bcrypt to compare password and user.password
      bcrypt.compare(password, user.password, function (err, res) {
        if(err){
          reject({ message: err.message })
        }
        if(res){
          
          // if there's no lock or failed attempts, just return the user
          if (!user.loginAttempts && !user.lockUntil) {
            resolve(user);
          }
          // reset attempts and lock info
          let updates = {
              $set: { loginAttempts: 0 },
              $unset: { lockUntil: 1 }
          };
          
          user.update(updates, function(err) {
            if (err) { reject( { message: err.message }) };
            resolve(user);
          });

        }
        
        // password is incorrect, so increment login attempts before responding
        user.incLoginAttempts(function(err) {
          if (err) { reject({ message: err.message})};
          reject({ message: reasons.PASSWORD_INCORRECT}) ;
        });

      });
    });

  });
}


UserSchema.statics.updateUsersCredentials = function (_id, updates){
  var User = this;
  return User.findByIdAndUpdate({ _id }, { $set: updates
  }, { new: true }).then(function(user){
    return user.save();
  });
}


UserSchema.virtual('isLocked').get(function() {
  // check for a future lockUntil timestamp
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

//moogoose middleware used before saving doc
UserSchema.pre('save', function(next){
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err); }      
      user.password = hash;
      next();
    });
  });
  
});


UserSchema.methods.incLoginAttempts = function(cb) {
  // if we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.update({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    }, cb);
  }
  // otherwise we're incrementing
  var updates = { $inc: { loginAttempts: 1 } };
  // lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }
  return this.update(updates, cb);
};

// expose enum on the model, and provide an internal convenience reference 
var reasons = UserSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPTS: 2
};


const User = mongoose.model('User', UserSchema);

export default User;