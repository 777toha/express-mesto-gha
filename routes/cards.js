const router = require('express').Router();

const { getCards, postCard, deleteCard, putCardLike, deleteCardLike} = require('../controllers/cards');
const { postCardValidation } = require('../middlewares/validate');

router.get('/cards', getCards);

router.post('/cards', postCardValidation, postCard);

router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', putCardLike);

router.delete('/cards/:cardId/likes', deleteCardLike);

module.exports = router;
