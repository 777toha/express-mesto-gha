const express = require('express');

const router = express.Router();
const User = require('../models/user');
const { getUsers, postUsers, getUsersById, patchUsersInfo, patchUsersAvatar, } = require('../controllers/users')

router.get('/users', getUsers);

router.post('/users', postUsers);

router.get('/users/:userId', getUsersById);

router.patch('/users/me', patchUsersInfo)

router.patch('/users/me/avatar', patchUsersAvatar);

module.exports = router;
