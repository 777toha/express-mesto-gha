const router = require('express').Router();

const Cards = require('../models/cards');
const { getCards, postCard, deleteCard, putCardLike, deleteCardLike} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', postCard);

router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', putCardLike);

router.delete('/cards/:cardId/likes', deleteCardLike);

module.exports = router;
