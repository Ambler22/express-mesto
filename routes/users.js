const router = require('express').Router();
const { getUser, getUserById, createUser, updateUser, updateAvatar } = require('../controllers/users');

router.get('/', getUser);
router.get('/:userId', getUserById);

router.post('/', createUser);

router.patch('users/me', updateUser);
router.patch('users/me/avatar', updateAvatar);

module.exports = router;