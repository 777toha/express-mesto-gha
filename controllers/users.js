const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const BADREQ_CODE = 400;
const NOTFOUND_CODE = 404;
const CONFLICT_CODE = 500;

const getMe = (req, res, next) => {
  User.findById(req.user._id)
  .then(user => res.send(user));
}

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(BADREQ_CODE).send({ message: err.message });
      } else {
        return res.status(CONFLICT_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    })
    .catch(next);
}

const postUsers = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ name, about, avatar, email, password: hash })
        .then((users) => res.send({
          name: users.name,
          about: users.about,
          avatar: users.avatar,
          email: users.email
        }))
        .catch(err => {
          if (err.name === 'ValidationError') {
            return res.status(BADREQ_CODE).send({ message: err.message });
          }
          if (err.name === 'MongoServerError') {
              return res.status(409).send({ message: 'Такой email уже существует' });
          }
          else {
            return res.status(CONFLICT_CODE).send({ message: 'На сервере произошла ошибка' });
          }
        })
        .catch(next);
    })
}

const getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user)
    })
    .catch(err => {
      if (req.params.userId.length !== 24) {
        return res.status(BADREQ_CODE).send({ message: err.message });
      } else if (err.name === 'DocumentNotFoundError') {
        return res.status(NOTFOUND_CODE).send({ message: err.message });
      } else {
        return res.status(CONFLICT_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    })
}

const patchUsersInfo = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  if (!name) {
    return res.status(BADREQ_CODE).send({ message: 'Переданы некорректные данные при обновлении имени профиля.' })
  } else if (!about) {
    return res.status(BADREQ_CODE).send({ message: 'Переданы некорректные данные при обновлении професиии профиля.' })
  }
  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err) {
        return res.status(BADREQ_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' })
      }
    })
    .catch(next);
}

const patchUsersAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(BADREQ_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' })
  }
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err) {
        return res.status(BADREQ_CODE).send({ message: 'Переданы некорректные данные при обновлении имени профиля.' })
      }
    })
    .catch(next);
}

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail()
    .then(async (user) => {
      if (!user) {
        return res.status(401).send({ message: 'Неправильные почта или пароль' });
      }
      const data = await bcrypt.compare(password, user.password);
      if (data) {
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
        res.cookie('jwt', token, {
          httpOnly: true
        }).send(user);
      } else {
        return res.status(401).send({ message: 'Неправильные почта или пароль' });
      }
    })
    .catch(err => {
      res
        .status(401)
        .send({ message: 'Неправильные почта или пароль' });
    })
};

module.exports = {
  getUsers,
  postUsers,
  getUsersById,
  patchUsersInfo,
  patchUsersAvatar,
  login,
  getMe
};
