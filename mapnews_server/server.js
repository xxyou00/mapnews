const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { PORT, MONGO_URI } = require('./config');

const favoritesRoutes = require('./routes/favorites');
const authRoutes = require('./routes/auth');
const newsRoutes = require('./routes/news');
const citiesRoutes = require('./routes/cities');
const sourcesRoutes = require('./routes/source');

const app = express();

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB подключен'))
    .catch(err => console.error('Ошибка подключения:', err));

app.use(express.json());

app.use(cors()); 

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/favorites', favoritesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/sources', sourcesRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Что-то пошло не так!' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});