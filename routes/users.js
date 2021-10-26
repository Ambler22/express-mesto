const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  getUsers, getUserById, updateUser, updateAvatar, getUser,
} = require('../controllers/users');

const validation = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('Введена некорректная ссылка.');
};

router.get('/users', getUsers);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUserById);

router.get('/users/me', getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validation),
  }),
}), updateAvatar);

module.exports = router;
