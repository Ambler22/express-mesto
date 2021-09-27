const router = require('express').Router();
const { getUser, getUserById, createUser, updateUser, updateAvatar } = require('../controllers/users');

router.get('/', getUser);
router.get('/:userId', getUserById);

router.post('/', createUser);

router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;