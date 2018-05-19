import expect from 'expect';
import request from 'supertest';
import { ObjectID }  from 'mongodb';

import  app  from '../../app';
import db from './../models';

import { users, poems, populatePoems , populateUsers} from './seed/seed';

beforeEach(populateUsers);
beforeEach(populatePoems);


describe('POST /api/poems', () => {

  it('should create a new poem', (done) => {
    const title = 'Test poem title';
    const message = "A NEW POEM";
    const _creator = users[0]._creator;

    request(app)
      .post('/api/poems')
      .set('x-auth', users[0].tokens[0].token)
      .send({
        title,
        message,
        _creator
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);        
        expect(res.body.poem.title).toBe(title);
        expect(res.body.poem.message).toBe(message);        
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        db.Poem.find({
          title
        }).then((poems) => {
          expect(poems.length).toBe(1);
          expect(poems[0].title).toBe(title);
          expect(poems[0].message).toBe(message);         
          done();
        }).catch((e) => done(e));
      })

  });


  it('should not create poem with invalid body data', (done) => {
    request(app)
      .post('/api/poems')
      .set('x-auth', users[0].tokens[0].token)
      .send({}) //invalid body data
      .expect(400)
      .end((err) => {
        if (err) {
          return done(err);
        }
        db.Poem.find().then((poems) => {
          expect(poems.length).toBe(2);
          done();
        }).catch((e) => done(e));
      })
  })
});

describe('GET /api/poems', () => {
  it('should get all poems', (done) => {
    request(app)
      .get('/api/poems')
      .expect(200)
      .expect((res) => {
        expect(res.body.poems.length).toBe(2);
      })
      .end(done);
  })
});

describe('GET /api/poems/:id', () => {
  it('should return poem doc', (done) => {
    request(app)
      .get(`/api/poems/${poems[0]._id.toHexString()}`)     
      .expect(200)
      .expect((res) => {
        expect(res.body.poem.title).toBe(poems[0].title);
        expect(res.body.poem._creator.username).toBe(users[0].username);        
      })
      .end(done);
  });

  it('should return 404 if poem not found', (done) => {
    var hexId = new ObjectID();
    request(app)
      .get(`/api/poems/${hexId.toHexString()}`)     
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/api/poems/1234')     
      .expect(404)
      .end(done);
  });

});

describe('DELETE /poems/:id', () => {
  it('should remove a poem', (done) => {
    var hexId = poems[1]._id.toHexString()
    request(app)
      .delete(`/api/poems/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)            
      .expect(200)
      .expect((res) => {
        expect(res.body.poem._id).toBe(hexId)
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        db.Poem.findById(hexId).then((poem) => {
          expect(poem).toBeFalsy();
          done();
        }).catch((e) => done(e));
      });
  });
  it('should return 404 if poem not found', (done) => {
    var hexId = new ObjectID()
    request(app)
      .delete(`/api/poems/${hexId.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)                  
      .expect(404)
      .end(done);
  });
    
  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/poems/1234')
      .set('x-auth', users[1].tokens[0].token)                  
      .expect(404)
      .end(done);
  })
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/api/users/me')
      .set('x-auth', users[0].tokens[0].token) //set header in test
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBe(users[0]._id.toHexString());
        expect(res.body.data.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/api/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toBe("Unauthorized request ");
      })
      .end(done);
  });

});

// describe('PATCH /poems/:id', () => {
//   it('should update the poem', (done) => {
//     var hexId = poems[0]._id.toHexString();
//     var title = "test updates";

//     request(app)
//       .patch(`/poems/${hexId}`)
//       .set('x-auth', users[0].tokens[0].token)
//       .send({title, completed: true})
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.poem.title).toBe(title);
//         expect(res.body.poem.completed).toBe(true);
//         expect(typeof(res.body.poem.completedAt)).toBe('number');
//       })
//       .end(done);
//   });

//   it('should not update the poem created by other user', (done) => {
//     var hexId = poems[0]._id.toHexString();
//     var title = "test updates";

//     request(app)
//       .patch(`/poems/${hexId}`)
//       .set('x-auth', users[1].tokens[0].token)
//       .send({title, completed: true})
//       .expect(404)
//       .end(done);
//   });

//   it('should clear completedAt when poem is not comleted', (done) => {
//     var hexId = poems[1]._id.toHexString();
//     var title = "test updates !!";

//     request(app)
//       .patch(`/poems/${hexId}`)
//       .set('x-auth', users[1].tokens[0].token)      
//       .send({title, completed: false})
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.poem.title).toBe(title);
//         expect(res.body.poem.completed).toBe(false);
//         expect(res.body.poem.completedAt).toBeFalsy();
//       })
//       .end(done);
//   });
// });



// describe('POST /users', () => {
//   it('should create a user', (done) => {
//     var email = 'example@example.com';
//     var password = '123abc!';
//     request(app)
//       .post('/users')
//       .send({email, password})
//       .expect(200)
//       .expect((res) => {
//         expect(res.headers['x-auth']).toBeTruthy();
//         expect(res.body._id).toBeTruthy();
//         expect(res.body.email).toBe(email);
//       })
//       .end((err) => {
//         if(err){
//           return done(err);
//         }
//         User.findOne({email}).then((user) => {
//           expect(user).toBeTruthy();
//           expect(user.password).not.toBe(password);
//           done();
//         }).catch((e) => done(e));
//       });
//   });

//   it('should return validation error if request invalid', (done) => {
//     var email = 'example.com';
//     var password = '12';
//     request(app)
//       .post('/users')
//       .send({email, password})
//       .expect(400)
//       // .expect((res) => {
//       //   expect(res.body.errors).toExist();
//       // })
//       .end(done)
//   });

//   it('should not create user if email in user', (done) => {
//     var email = users[0].email;
//     var password = users[0].password;

//     request(app)
//       .post('/users')
//       .send({email, password})
//       .expect(400)
//       .end(done)
//   })
// });

// describe('POST /users/login', () => {

//   it('should login user and return auth token', (done) => {
//     request(app)
//       .post('/users/login')
//       .send({
//         email: users[1].email,
//         password: users[1].password
//       })
//       .expect(200)
//       .expect((res) => {
//         expect(res.headers['x-auth']).toBeTruthy();
//       })
//       .end((err, res) => {
//         if(err){
//           return done(err);
//         }
//         User.findById(users[1]._id).then((user) => {
//           expect(user.toObject().tokens[user.tokens.length - 1]).toMatchObject({
//             access: 'auth',
//             token: res.headers['x-auth']
//           });
//           done();
//         }).catch((e) => done(e));
//       });
//   });

//   it('should reject invalid login', (done) => {
//     request(app)
//       .post('/users/login')
//       .send({
//         email: users[1].email,
//         password: users[1].password + '1'
//       })
//       .expect(400)
//       .expect((res) => {
//         expect(res.headers['x-auth']).toBeFalsy();
//       })
//       .end((err, res) => {
//         if(err){
//           return done(err);
//         }
//         User.findById(users[1]._id).then((user) => {
//           expect(user.tokens.length).toBe(1)
//           done();
//         }).catch((e) => done(e));
//       });
//   });
// });

// describe('DELETE /users/me/token', () => {
//   it('should remove auth token on logout', (done) => {
//     request(app)
//       .delete('/users/me/token')
//       .set('x-auth', users[0].tokens[0].token)
//       .expect(200)
//       .end((err, res) => {
//         if(err){
//           return done(err);
//         }
//         User.findById(users[0]._id).then((user) => {
//           expect(user.tokens.length).toBe(0);
//           done();
//         }).catch((e) => done(e));
//       });
//   });

