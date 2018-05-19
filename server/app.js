import './config/config';

import express from 'express';
import bodyParser from 'body-parser';

//connect to db right here..
import mongoose from './api/db/mongoose';

//import routes
import routes from './api/routes';

const app = express();

//Middleware right here...
app.use(bodyParser.json());
app.use('/api', routes);

export default app;