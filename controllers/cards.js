const express = require('express');
const Cards = require('../models/cards');
const BADREQ_CODE = 400;
const NOTFOUND_CODE = 404;
const CONFLICT_CODE = 500;

const getCards = (req, res, next) => {
  Cards.find({})
    .then((user) => {
      res.send(user);
    })
    .catch(next)
}

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Cards.create({ name, link, owner })
    .then((user) => {
      res.send(user);
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(BADREQ_CODE).send({ message: err.message });
      } else {
        return res.status(CONFLICT_CODE).send({ message: err.message });
      }
    })
    .catch(next);
}

const deleteCard = (req, res, next) => {
  const userId = req.user._id;

  Cards.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner == userId) {
        Cards.findByIdAndDelete(req.params.cardId)
          .then(user => {
            res.send(user);
          })
          .catch(err => {
            if (err) {
              res.send(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}`)
            }
          })
          .catch(next);
      } else {
        return res.send('Вы не можете удалить карточку, если вы не являетесь ее создателем')
      }
    })
    .catch((err) => {
      if (req.params.cardId.length !== 24) {
        return res.status(BADREQ_CODE).send({ message: err.message });
      } else if (err.name === 'CastError') {
        return res.status(NOTFOUND_CODE).send({ message: err.message });
      } else {
        return res.status(CONFLICT_CODE).send({ message: err.message });
      }
    })
}

const putCardLike = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      if (req.params.cardId.length !== 24) {
        return res.status(BADREQ_CODE).send({ message: err.message });
      } else if (err.name === 'DocumentNotFoundError') {
        return res.status(NOTFOUND_CODE).send({ message: err.message });
      } else {
        return res.status(CONFLICT_CODE).send({ message: err.message });
      }
    })
}

const deleteCardLike = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      if (req.params.cardId.length !== 24) {
        return res.status(BADREQ_CODE).send({ message: err.message });
      } else if (err.name === 'DocumentNotFoundError') {
        return res.status(NOTFOUND_CODE).send({ message: err.message });
      } else {
        return res.status(CONFLICT_CODE).send({ message: err.message });
      }
    })
}

module.exports = {
  getCards,
  postCard,
  deleteCard,
  putCardLike,
  deleteCardLike
};
