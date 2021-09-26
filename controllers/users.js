const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены');
      }
      return res.send(users);
    })
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(' Пользователь по указанному _id не найден.');
      }
      res.send(user);
    })
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      if (!name || !about || !avatar) {
        throw new BadRequestError('Переданы некорректные данные');
      }
      res.send(user);
    })
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about },
    { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar },
    { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};