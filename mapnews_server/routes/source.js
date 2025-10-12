const express = require('express');
const router = express.Router();
const sourcesController = require('../controllers/sourcesController');

router.get('/', sourcesController.getAllSources);

router.get('/:id', sourcesController.getSourceById);

router.post('/', sourcesController.createSource);

router.put('/:id', sourcesController.updateSource);

router.delete('/:id', sourcesController.deleteSource);

module.exports = router;
