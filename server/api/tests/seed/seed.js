import { ObjectID } from 'mongodb';
import jwt from 'jsonwebtoken';
import db from '../../models';

// seed data...
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const poemOneId = new ObjectID();
const poemTwoId = new ObjectID();
const commentOneId = new ObjectID();
const commentTwoId = new ObjectID();


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
  _id: poemOneId,
  title: 'First test poem',
  message: "Message for first poem",
  _creator: userOneId
}, {
  _id: poemTwoId,
  title: 'Second test poem',
  message: "Message for first poem",
  _creator: userTwoId
}];

const comments = [{
  _id: commentOneId,
  message: "Comment for first poem",
  _creator: userOneId,
  _poem: poemOneId 
}, {
  _id: commentTwoId,
  message: "Comment for first poem",
  _creator: userTwoId,
  _poem: poemTwoId,
  _parentId: commentTwoId
}]


const populatePoems = () => {
  return db.Poem.remove({}).then(() => {
    return db.Poem.insertMany(poems);
  })
};


const populateComments = () => {
  return db.Comment.remove({}).then(() => {
    return db.Comment.insertMany(comments);
  })
};

const populateUsers = async () => {
  await db.User.remove({});
  const userOne = await new db.User(users[0]).save();
  const userTwo = await new db.User(users[1]).save();
  // return db.User.remove({}).then(() => {
  //   const userOne = new db.User(users[0]).save();
  //   const userTwo = new db.User(users[1]).save();

  //   return Promise.all([userOne, userTwo]);
  // })
}

export {
  poems, populatePoems, users, populateUsers, populateComments, comments
}
