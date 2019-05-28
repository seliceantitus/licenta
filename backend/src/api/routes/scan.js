const express = require('express');
const router = express.Router();
const scanController = require('../controller/scanController');

router.route('/')
    .get(scanController.index)
    .post(scanController.new);

router.route('/:scan_id')
    .get(scanController.view);

module.exports = router;