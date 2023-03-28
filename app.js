const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const {errors} = require('celebrate');
const { postUsers, login } = require('./controllers/users');
const { loginValidation, postUsersValidation } = require('./middlewares/validate');
const { auth } = require('./middlewares/auth');
const mongoose = require('mongoose');

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
app.use(cookieParser());

app.post('/signup', postUsersValidation, postUsers);

app.post('/signin', loginValidation, login);

app.use(auth);

app.use('/', userRouter);
app.use('/', cardRouter);


app.use('*', (req, res, next) => {
  const err = new Error('Запрашиваемый ресурс не найден');
  err.statusCode = 404;

  next(err);
})

app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message || 'Ошибка'});
});

app.listen(PORT, () => {
  console.log(`Port ${PORT}`);
});
