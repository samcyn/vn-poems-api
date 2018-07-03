import Joi from 'joi';

const userControllerPolicy = {};

userControllerPolicy.post = (req, res, next) => {
  const schema = {
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().regex(
      new RegExp('^[a-zA-Z0-9]{8,32}$')
    )
  };

  const { error, value } = Joi.validate(req.body, schema);
  console.log(value);
  if (error) {
    switch (error.details[0].context.key) {
      case 'email':
        res.status(400).json({
          message: 'You must provide a valid email details'
        });
        break;
      case 'password':
        res.status(400).json({
          message: ` The password provide must: <br>
            1. it must contain lower case, uppercase , numerics
            <br>
            2. it be at least 8 characters.
          `
        });
        break;
      default:
        res.status(400).json({
          message: 'Invalid credentials supplied'
        });
    }
  }
  else { next() }
}


export default userControllerPolicy;
