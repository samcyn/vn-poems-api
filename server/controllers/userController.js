import db from './../models';


const userController = {};

userController.post = async (req, res) => {
  try{
    const { email, password } = req.body;
  
    const user = new db.User({ email, password });
   
    const newUser = await user.save();
    const token = await user.generateAuthToken();
    
    res.header('x-auth', token).status(200).json({
      success: true,
      data: newUser
    });
  } catch(err){
    res.status(400).json({
      message: err.message
    });
  }
}

userController.get = (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};

userController.login = async (req, res) => {
  try{
    const { email, password } = req.body;
    const user = await db.User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.header('x-auth', token).json({
      success: true,
      data: user
    });
  } catch(err){
    res.status(400).json({
      message: err.message
    });
  }
};

userController.delete = async (req, res) => {
  try{
    const user = await req.user.removeToken(req.token);
    res.status(200).json({
      success: true,
      data: user
    });
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