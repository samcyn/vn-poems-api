import db from './../models';


const userController = {};

userController.post = async (req, res) => {
  try{
    const { username, email, password } = req.body;
  
    const user = new db.User({ username, email, password });
   
    const newUser = await user.save();
    const token = await user.generateAuthToken();
    
    const response = {
      success: true,
      user: {
        ...newUser.toObject(),
        request: {
          type: 'GET',
          description: 'GET user using url',
          url: `http://localhost:3000/api/users/me`
        }
      }
    }

    res.header('x-auth', token).status(200).json(response);
  } catch(err){
    res.status(400).json({
      message: err.message
    });
  }
}

userController.get = (req, res) => {
  const response = {
    success: true,
    user: {
      ...req.user.toObject(),
      request: {
        type: 'POST',
        description: 'POST user using url',
        url: 'http://localhost:3000/api/users',
        data: { username: 'String', email: 'String', password: 'ObjectID'}        
      }
    }
  }

  res.status(200).json(response);
};

userController.login = async (req, res) => {
  try{
    const { email, password } = req.body;
    const user = await db.User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    const response = {
      success: true,
      user: {
        ...user.toObject(),
        request: {
          type: 'POST',
          description: 'POST user using url',
          url: 'http://localhost:3000/api/users',
          data: { username: 'String', email: 'String', password: 'ObjectID'}        
        }
      }
    }
  
    res.header('x-auth', token).json(response);
  } catch(err){
    res.status(400).json({
      message: err.message
    });
  }
};

userController.delete = async (req, res) => {
  try{
    const user = await req.user.removeToken(req.token);

    const response = {
      success: true,
      user: {
        user,
        request: {
          type: 'POST',
          description: 'POST user using url',
          url: 'http://localhost:3000/api/users',
          data: { username: 'String', email: 'String', password: 'ObjectID'}        
        }
      }
    }
  
    res.status(200).json(response);
  } catch(err){
    res.status(400).json({
      message: err.message
    })
  }
};

userController.patch = async (req, res) => {
  const user = req.user;
  const updates = req.body;
  try{
    const newUpdates = await db.User.updateUsersCredentials(user._id, updates);
    const token = await user.generateAuthToken();
    user.save();
    res.header('x-auth', token).status(200).json({
      success: true,
      data: newUpdates
    });
  } catch(err){
    res.status(400).json({
      message: err.message
    })
  }
}


export default userController;