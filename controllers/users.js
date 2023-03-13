const express = require('express');
const User = require('../models/user');
const BADREQ_CODE = 400;
const NOTFOUND_CODE = 404;
const CONFLICT_CODE = 500;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(BADREQ_CODE).send({ message: err.message });
      } else {
        return res.status(CONFLICT_CODE).send({ message: err.message });
      }
    })
    .catch(next);
}

const postUsers = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((users) => res.send(users))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(BADREQ_CODE).send({ message: err.message });
      } else {
        return res.status(CONFLICT_CODE).send({ message: err.message });
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
      if (req.params.userId.length !== 24) {
        return res.status(BADREQ_CODE).send({ message: err.message });
      } else if (err.name === 'CastError') {
        return res.status(NOTFOUND_CODE).send({ message: err.message });
      } else {
        return res.status(CONFLICT_CODE).send({ message: err.message });
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

module.exports = {
  getUsers,
  postUsers,
  getUsersById,
  patchUsersInfo,
  patchUsersAvatar
};
