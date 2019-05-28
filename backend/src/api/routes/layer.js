const express = require('express');
const router = express.Router();
const layerController = require('../controller/layerController');

router.route('/')
    .get(layerController.index)
    .post(layerController.new);

router.route('/:layer_id')
    .delete(layerController.delete);

module.exports = router;