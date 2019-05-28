Scan = require('../models/scan.model');

exports.new = (req, res) => {
    let model = new Scan(req.body);
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({status: "error", error: 'Missing request body'});
    }
    model.save()
        .then(result => {
            if (!result || result.length === 0) {
                return res.status(500).json({status: "error", error: 'Unknown', data: result});
            }
            return res.status(201).json({status: "success", data: result});
        })
        .catch(err => {
            return res.status(500).json({status: "error", error: err});
        });
};

exports.index = (req, res) => {
    Scan.find({}, (err, scans) => {
        if (err) {
            return res.status(500).json({status: 'error', error: err});
        }
        return res.status(200).json({status: 'success', data: scans});
    })
};

exports.view = (req, res) => {
    Scan.findById(req.params.scan_id, (err, scan) => {
        if (err) {
            return res.status(500).json({status: 'error', error: err});
        }
        return res.status(200).json({status: 'success', data: scan});
    });
};