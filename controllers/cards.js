const express = require('express');
const Cards = require('../models/cards');

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
      if (err) {
        res.send(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}`)
      }
    })
    .catch(next);
}

const deleteCard = (req, res, next) => {
  const userId = req.user._id;

  Cards.findById(req.params.cardId)
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
    .catch(() => {
      res.send('Карточка с таким id не найдена');
    })
}

const putCardLike = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then(user => {
    res.send(user);
  })
  .catch(err => {
    if (err) {
      res.send(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}`)
    }
  })
  .catch(next);
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
    if (err) {
      res.send(`При выполнении кода произошла ошибка ${err.name} c текстом ${err.message}`)
    }
  })
  .catch(next);
}

module.exports = {
  getCards,
  postCard,
  deleteCard,
  putCardLike,
  deleteCardLike
};
