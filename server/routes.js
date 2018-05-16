import express from 'express';

//Authentication
import authenticate from './middleware/authenticate';

// Controller Imports,,
import basicController from './controllers/basicController';
import userController from './controllers/userController';
import poemController from './controllers/poemController';


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
routes.post('/poems', poemController.post);
routes.get('/poems', poemController.getAll);
routes.get('/poems/:poemId', poemController.getOne);
routes.patch('/poems/:poemId', poemController.patch);
routes.delete('/poems/:poemId', poemController.delete);


export default routes;