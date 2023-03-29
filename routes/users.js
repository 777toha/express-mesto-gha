const express = require('express');

const router = express.Router();
const {
  getUsers,
  getMe,
  getUsersById,
  patchUsersInfo,
  patchUsersAvatar,
} = require('../controllers/users');

const { getUsersByIdValidation, patchUsersInfoValidation, patchUsersAvatarValidation } = require('../middlewares/validate');

router.get('/users', getUsers);

router.get('/users/me', getMe);

router.get('/users/:userId', getUsersByIdValidation, getUsersById);

router.patch('/users/me', patchUsersInfoValidation, patchUsersInfo);

router.patch('/users/me/avatar', patchUsersAvatarValidation, patchUsersAvatar);

module.exports = router;
