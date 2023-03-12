const express = require('express');
const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(err => {
      if (err) {
        res.send(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}`)
      }
    })
    .catch(next);
}

const postUsers = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((users) => res.send(users))
    .catch(err => {
      if (err) {
        res.send(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}`)
      }
    })
    .catch(next);
}

const getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.send(user)
    })
    .catch(err => {
      if (err) {
        res.send(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}`)
      }
    })
    .catch(next);
}

const patchUsersInfo = (req, res, next) => {
  const userId  = req.user._id;
  const { name, about } = req.body;
  if (!name) {
    return res.status(400).send('Переданы некорректные данные при обновлении имени профиля.')
  } else if (!about) {
    return res.status(400).send('Переданы некорректные данные при обновлении професиии профиля.')
  }
  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err) {
        res.send(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}`)
      }
    })
    .catch(next);
}

const patchUsersAvatar = (req, res, next) => {
  const userId  = req.user._id;
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).send('Переданы некорректные данные при обновлении профиля.')
  }
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err) {
        res.send(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}`)
      }
    })
    .catch(next);
}

module.exports = {
  getUsers,
  postUsers,
  getUsersById,
  patchUsersInfo,
  patchUsersAvatar
};
