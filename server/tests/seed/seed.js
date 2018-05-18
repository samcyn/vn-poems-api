import { ObjectID } from 'mongodb';
import jwt from 'jsonwebtoken';
import db from '../../models';

// seed data...
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  username: "Samcyn",
  email: 'andrew@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  username: "jide",
  email: 'jen@example.com',
  password: 'userTwoPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const poems = [{
  _id: new ObjectID(),
  title: 'First test poem',
  message: "Message for first poem",
  _creator: userOneId
}, {
  _id: new ObjectID(),
  title: 'Second test poem',
  message: "Message for first poem",
  _creator: userTwoId
}];


const populatePoems = () => {
  return db.Poem.remove({}).then(() => {
    return db.Poem.insertMany(poems);
  })
};

const populateUsers = () => {
  return db.User.remove({}).then(() => {
    var userOne = new db.User(users[0]).save();
    var userTwo = new db.User(users[1]).save();

    return Promise.all([userOne, userTwo])
  })
}

export {
  poems, populatePoems, users, populateUsers
}
