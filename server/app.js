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

//GLOBAL ERROR HANDLER
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    messege: error.messege
  });
});

export default app;