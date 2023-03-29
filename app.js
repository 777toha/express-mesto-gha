const { errors } = require('celebrate');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { postUsers, login } = require('./controllers/users');
const { loginValidation, postUsersValidation } = require('./middlewares/validate');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(cookieParser());

app.post('/signup', postUsersValidation, postUsers);
app.post('/signin', loginValidation, login);
app.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

app.use(auth);

app.use('/', userRouter);
app.use('/', cardRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT);
