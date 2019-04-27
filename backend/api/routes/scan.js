const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: '[GET] Hello from Scan.js'
    });
});

router.post('/', (req, res) => {
    res.status(200).json({
        message: '[POST] Hello from Scan.js'
    });
});

module.exports = router;