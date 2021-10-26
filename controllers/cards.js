const Card = require('../models/card');

const BadRequestError = require('../errors/bad-request-error');
const ServerError = require('../errors/server-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      next(new ServerError('Произошла ошибка'));
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Невалидный id.'));
      } else {
        next(new ServerError('Произошла ошибка'));
      }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findByIdAndRemove(cardId)
    .then((data) => {
      if (!data) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } if (owner !== String(data.owner)) {
        next(new ForbiddenError('Вы не можете удалить эту карточку.'));
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Невалидный id.');
      } else {
        throw new ServerError('Произошла ошибка');
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Невалидный id.');
      } else {
        throw new ServerError('Произошла ошибка');
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Невалидный id.');
      } else {
        throw new ServerError('Произошла ошибка');
      }
    });
};
