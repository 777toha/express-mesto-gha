const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const postUsers = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((users) => res.send({
          name: users.name,
          about: users.about,
          avatar: users.avatar,
          email: users.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Некорректные данные'));
          }
          if (err.name === 'MongoServerError') {
            next(new ConflictError('Такой email уже существует'));
          } else {
            next(new InternalServerError('На сервере произошла ошибка'));
          }
        });
    });
};

const getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Такой пользователь не найден'));
      } else {
        next(new InternalServerError('На сервере произошла ошибка'));
      }
    });
};

const patchUsersInfo = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

const patchUsersAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then(async (user) => {
      if (!user) {
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      }
      const data = await bcrypt.compare(password, user.password);
      if (data) {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
        return res.cookie('jwt', token, {
          httpOnly: true,
        }).send({ message: 'Успешно' });
      }
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    })
    .catch(next);
};

module.exports = {
  getUsers,
  postUsers,
  getUsersById,
  patchUsersInfo,
  patchUsersAvatar,
  login,
  getMe,
};
