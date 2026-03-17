const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const sourceFavoritesController = require('../controllers/sourceFavoritesController');
const newsFavoritesController = require('../controllers/newsFavoritesController');
const cityFavoritesController = require('../controllers/cityFavoritesController');

router.get('/sources', authenticateToken, sourceFavoritesController.getSources);
router.post('/sources/:sourceId', authenticateToken, sourceFavoritesController.addSource);
router.delete('/sources/:sourceId', authenticateToken, sourceFavoritesController.removeSource);

router.get('/news', authenticateToken, newsFavoritesController.getNews);
router.post('/news/:newsId', authenticateToken, newsFavoritesController.addNews);
router.delete('/news/:newsId', authenticateToken, newsFavoritesController.removeNews);

router.get('/cities', authenticateToken, cityFavoritesController.getCities);
router.post('/cities/:cityId', authenticateToken, cityFavoritesController.addCity);
router.delete('/cities/:cityId', authenticateToken, cityFavoritesController.removeCity);

module.exports = router; 