import expect from 'expect';
import request from 'supertest';
import { ObjectID }  from 'mongodb';

import  app  from '../../app';
import db from './../models';

import { users, poems, comments, populatePoems , populateUsers, populateComments } from './seed/seed';

beforeEach(populateUsers);
beforeEach(populatePoems);
beforeEach(populateComments);

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
    let hexId = new ObjectID();
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

describe('DELETE /api/poems/:id', () => {
  it('should remove a poem', (done) => {
    let hexId = new ObjectID();
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

describe('PATCH /api/poems/:id', () => {
  it('should update the poem', (done) => {
    const hexId = poems[0]._id.toHexString();
    const title = "test updates";
    const message = "A new update in test";

    request(app)
      .patch(`/api/poems/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({title, message})
      .expect(200)
      .expect((res) => {
        expect(res.body.poem.title).toBe(title);
        expect(res.body.poem.message).toBe(message);
        expect(typeof(res.body.poem.updatedAt)).toBe('number');
      })
      .end(done);
  });

  it('should not update the poem created by other user', (done) => {
    const hexId = poems[0]._id.toHexString();
    const title = "test updates";
    const message = "A new update in test";

    request(app)
      .patch(`/poems/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({title, message})
      .expect(404)
      .end(done);
  });

  it('should not update when user is not authenticated', (done) => {
    const hexId = poems[1]._id.toHexString();
    const title = "test updates !!";

    request(app)
      .patch(`/api/poems/${hexId}`)     
      .send({title})
      .expect(401)
      .end(done);
  });
});

describe('PUT /api/poems/:poemId/upvote', () => {
  it('should add upvote to poem', (done) => {
    const hexId = poems[0]._id.toHexString();
    request(app)
      .put(`/api/poems/${hexId}/upvote`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.poem.voteScore).toBe(1);
        expect(res.body.poem.upVotes.length).toBe(1);
        expect(res.body.poem.downVotes.length).toBe(0);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        db.Poem.findById(hexId).then((poem) => {
          expect(poem.voteScore).toBe(1);
          expect(poem.upVotes).toContain(users[0]._id); //id of user added into upvotes array
          expect(poem.downVotes.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});


describe('PUT /api/poems/:poemId/downvote', () => {
  it('should add downvote to poem', (done) => {
    const hexId = poems[0]._id.toHexString();
    request(app)
      .put(`/api/poems/${hexId}/downvote`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.poem.voteScore).toBe(0);
        expect(res.body.poem.upVotes.length).toBe(0);
        expect(res.body.poem.downVotes.length).toBe(1);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        db.Poem.findById(hexId).then((poem) => {
          expect(poem.voteScore).toBe(0);
          expect(poem.upVotes.length).toBe(0); 
          expect(poem.downVotes).toContain(users[0]._id); //id of user added into upvotes array
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /api/users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/api/users/me')
      .set('x-auth', users[0].tokens[0].token) //set header in test
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.user._id).toBe(users[0]._id.toHexString());
        expect(res.body.user.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/api/users/me')
      .expect(401)
      .end(done);
  });

});

describe('POST /api/users', () => {
  it('should create a user', (done) => {
    const email = 'samcyn@example.com';
    const password = '123abc!';
    const username = "samcyn";
    request(app)
      .post('/api/users')
      .send({email, username, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body.user._id).toBeTruthy();
        expect(res.body.user.email).toBe(email);
        expect(res.body.user.username).toBe(username);        
      })
      .end((err) => {
        if(err){
          return done(err);
        }
        db.User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation error if request invalid', (done) => {
    const email = 'example.com';
    const password = '12';
    //no username for instance
    request(app)
      .post('/api/users')
      .send({email, password})
      .expect(400)
      .end(done)
  });

  it('should not create user if email or username is already taken', (done) => {
    const email = users[0].email;
    const password = users[0].password;
    const username = "Samcyn";
    request(app)
      .post('/api/users')
      .send({email, username, password})
      .expect(400)
      .end(done)
  })
});

describe('POST /api/users/login', () => {

  it('should login user and return auth token', (done) => {
    request(app)
      .post('/api/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        //the last token should match...
        db.User.findById(users[1]._id).then((user) => {
          expect(user.toObject().tokens[user.tokens.length - 1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    // invalid password for instance
    request(app)
      .post('/api/users/login')
      .send({
        email: users[1].email,
        password: "invalid-password"
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        db.User.findById(users[1]._id).then((user) => {
          //no tokens generated and added
          expect(user.tokens.length).toBe(1);
          expect(user.loginAttempts).toBe(1); // login attempt increase to 1
          done();
        }).catch((e) => done(e));
      });
  });
  
  it('should lock account on fifth fail login attempt', (done) => {
     // invalid password for instance
     request(app)
     .post('/api/users/login')
     .send({
       email: users[2].email,
       password: "invalid-password"
     })
     .expect(400)
     .expect((res) => {
       expect(res.headers['x-auth']).toBeFalsy();
     })
     .end((err, res) => {
       if(err){
         return done(err);
       }
       db.User.findById(users[2]._id).then((user) => {
         //no tokens generated and added
         expect(user.tokens.length).toBe(1);
         expect(user.loginAttempts).toBe(5); // login attempt increase by 1
         expect(user.isLocked).toBe(true);
         done();
       }).catch((e) => done(e));
     });
  });
});

describe('DELETE /api/users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/api/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        db.User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not remove token without authentication', (done) => {
    request(app)
      .delete('/api/users/me/token')
      .expect(401)
      .end(done)
  });
});


describe('POST /api/poems/:poemId/comments', () => {
  it('should add a new comment to poem', (done) => {
    const message = "Added comment to poem one"; 
    //comment added to poem in this case
    const poemId = poems[0]._id; 
    request(app)
      .post(`/api/poems/${poemId}/comments`)
      .set('x-auth', users[0].tokens[0].token)
      .send({message})
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.comment.message).toBe(message);
        expect(res.body.comment._parentId).toBeFalsy();
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        db.Comment.find({
          message
        }).then((comment) => {
          expect(comment.length).toBe(1);
          expect(comment[0].message).toBe(message);         
          done();
        }).catch((e) => done(e));
      })
  });

  it('should not add a new comment if no token/authentication', (done) => {
    const message = "Added comment to poem one"; 
    //comment added to poem in this case
    const poemId = poems[0]._id; 
    request(app)
    .post(`/api/poems/${poemId}/comments`)
    .send({message}) 
    .expect(401)
    .end((err, res) => {
      if(err){
       return done(err);
      }
      db.Poem.findById(poemId).then((poem) => {
        expect(poem._comments.length).toBe(0);
        done();
      }).catch((e) => done(e));
    })   
  });

  it('should add a new comment to another comment', (done) => {
    const message = "Added comment to another comment"; 
    const _parentId = comments[0]._id;
    const poemId = poems[0]._id; 

    request(app)
      .post(`/api/poems/${poemId}/comments/${_parentId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({message})
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.comment.message).toBe(message);
        expect(res.body.comment._parentId).toBeTruthy();
        // expect(res.body.comment._comments).toContain(_parentId);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        db.Comment.find({
          message
        }).then((comment) => {
          expect(comment.length).toBe(1);
          expect(comment[0].message).toBe(message);         
          done();
        }).catch((e) => done(e));
        
      })
  });
})
