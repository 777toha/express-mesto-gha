const router = require('express').Router();

const {
  getCards,
  postCard,
  deleteCard,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');
const { postCardValidation, getCardsByIdValidation } = require('../middlewares/validate');

router.get('/cards', getCards);

router.post('/cards', postCardValidation, postCard);

router.delete('/cards/:cardId', getCardsByIdValidation, deleteCard);

router.put('/cards/:cardId/likes', getCardsByIdValidation, putCardLike);

router.delete('/cards/:cardId/likes', getCardsByIdValidation, deleteCardLike);

module.exports = router;
