Scan = require('../models/scan.model');
Layer = require('../models/layer.model');
outlier = require('outlier');

exports.new = (req, res) => {
    let scan = new Scan(req.body);
    scan.save()
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

exports.view = (req, res) => {
    Scan.findById(req.params.scan_id, (err, scan) => {
        if (err) {
            return res.status(500).json({status: 'error', error: err});
        }
        Layer.find({scan: req.params.scan_id}, (err, layers) => {
            if (err) {
                return res.status(500).json({status: 'error', error: err});
            }

            return res.status(200).json(
                {
                    status: 'success',
                    data: {
                        scan: scan,
                        layers: layers
                    }
                }
            );
        });
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

exports.delete = (req, res) => {
    Layer.deleteMany({scan: req.params.scan_id})
        .catch(err => {
            return res.status(500).json({status: 'error', error: err});
        });
    Scan.deleteOne({_id: req.params.scan_id})
        .then(() => {
            return res.status(200).json({status: 'success'})
        })
        .catch(err => {
            return res.status(500).json({status: 'error', error: err});
        });
};
