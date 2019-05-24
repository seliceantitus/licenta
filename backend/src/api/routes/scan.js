const ScanModel = require('../../models/scan.model');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: '[GET] Hello from Scan.js'
    });
});

router.post('/', (req, res) => {
    console.log(req.body);
    if (req.body) {
        return res.status(400).send('Request body missing');
    }
    let model = new ScanModel(req.body);
    model.save()
        .then(doc => {
            if (!doc || doc.length === 0){
                return res.status(500).send(doc);
            }
            res.status(201).send(doc);
        })
        .catch(err => {
            res.status(500).json(err);
        });
    // res.status(200).json({
    //     message: '[POST] Hello from Scan.js'
    // });
});

module.exports = router;