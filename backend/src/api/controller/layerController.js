const mongoose = require("mongoose");
Layer = require('../models/layer.model');

exports.new = (req, res) => {
    let layer = new Layer({
        _id: mongoose.Types.ObjectId(),
        scan: req.body.scan_id,
        points: req.body.points,
    });
    layer.save()
        .then(result => {
            if (!result || result.length === 0) {
                return res.status(500).json({status: "error", error: 'Unknown', data: result});
            }
            return res.status(201).json({status: "success", data: result});
        })
        .catch(err => {
            return res.status(500).json({status: 'error', error: err});
        });
};

exports.index = (req, res) => {
    Layer.find({}, (err, layers) => {
        if (err) {
            return res.status(500).json({status: 'error', error: err});
        }
        return res.status(200).json({status: 'success', data: layers});
    })
};

exports.delete = (req, res) => {
    Layer.deleteOne({_id: req.params.layer_id})
        .then(() => {
            return res.status(200).json({status: 'success'})
        })
        .catch(err => {
            return res.status(500).json({status: 'error', error: err});
        });
};