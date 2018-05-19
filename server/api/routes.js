import express from 'express';

//Authentication
import authenticate from './middleware/authenticate';

// Controller Imports,,
import basicController from './controllers/basicController';
import userController from './controllers/userController';
import poemController from './controllers/poemController';
import commentController from './controllers/commentController';



const routes = express();

// Basic routes..
routes.get('/', basicController.get);

// User routes..
routes.post('/users', userController.post);
routes.get('/users/me', authenticate , userController.get);
routes.post('/users/login', userController.login);
routes.delete('/users/me/token', authenticate, userController.delete);
routes.patch('/users/me', authenticate, userController.patch);

// Poem Routes..
routes.post('/poems', authenticate, poemController.post);
routes.get('/poems', poemController.getAll);
routes.get('/poems/:poemId', poemController.getOne);
routes.patch('/poems/:poemId', authenticate, poemController.patch);
routes.delete('/poems/:poemId', authenticate, poemController.delete);

// Comment Routes
routes.post('/comments', authenticate, commentController.post);
routes.get('/comments', commentController.getAll);
routes.get('/comments/:commentId', commentController.getOne);




export default routes;