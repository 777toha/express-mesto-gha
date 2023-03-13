const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const mongoose = require('mongoose');
const NOTFOUND_CODE = 404;

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Connected');
  })
  .catch((error) => {
    console.log(`Error ${error}`);
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '640da37b3c6889cd461c65a2'
  }

  next();
});


app.use('/', userRouter);
app.use('/', cardRouter);
app.use((req, res) => {
  return res.status(NOTFOUND_CODE).send({ message: 'Запрашиваемый ресурс не найден' });
})
app.listen(PORT, () => {
  console.log(`Port ${PORT}`);
});
