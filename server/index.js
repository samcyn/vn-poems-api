import app from './app';

const port = process.env.PORT;


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});
