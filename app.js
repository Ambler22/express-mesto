const express = require('express');
const mongoose = require('mongoose');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6150e0065c76ef4688a82261',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Данные не найдены' });
});

app.listen(PORT);
