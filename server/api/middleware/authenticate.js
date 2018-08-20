import db from './../models';

const authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  //MODEL METHOD CALLED
  db.User.findByToken(token).then((user) => {
    if(!user){
      return Promise.reject({ message: "Unauthorized request "});
    }
    // res.send(user);
    req.user = user;
    req.token = token;
    next();
  }).catch((err) => {
    res.status(401).json({
      message: err.message
    }); 
  });
}; 

export default authenticate;