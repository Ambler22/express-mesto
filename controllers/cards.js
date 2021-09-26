const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const userId = req.user._id;
  Card.create({ name, link, userId })
    .then((card) => res.send(card))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card === null) {
        throw new BadRequestError('Карточка с указанным _id не найдена.');
      }
      return res.send(card);
    })
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new BadRequestError('Карточка с указанным _id не найдена.');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
    })
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new BadRequestError('Карточка с указанным _id не найдена.');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
    })
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};