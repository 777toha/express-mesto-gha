const Cards = require('../models/cards');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Cards.find({})
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Cards.create({ name, link, owner })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(new InternalServerError('На сервере произошла ошибка'));
      }
    });
};

const deleteCard = (req, res, next) => {
  const userId = req.user._id;

  Cards.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() === userId) {
        Cards.findByIdAndDelete(req.params.cardId)
          .then((user) => {
            res.send(user);
          })
          .catch(next);
      } else {
        next(new ForbiddenError('Вы не можете удалить карточку, если вы не являетесь ее создателем'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Такая карточка не найдена'));
      } else {
        next(new InternalServerError('На сервере произошла ошибка'));
      }
    });
};

const putCardLike = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Такая карточка не найдена'));
      } else {
        next(new InternalServerError('На сервере произошла ошибка'));
      }
    });
};

const deleteCardLike = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Такая карточка не найдена'));
      } else {
        next(new InternalServerError('На сервере произошла ошибка'));
      }
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
};
