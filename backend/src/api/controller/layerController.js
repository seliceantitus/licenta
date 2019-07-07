const mongoose = require("mongoose");
const outlier = require("outlier");
Layer = require('../models/layer.model');

function findErrorPositions(originalArray, outliersArray) {
    let positions = [];
    outliersArray.forEach((distance) => {
        let i = -1;
        let foundPos = [];
        while ((i = originalArray.indexOf(distance, i + 1)) !== -1) {
            foundPos.push(i);
        }
        positions = [].concat.apply(positions, foundPos)
    });
    return positions;
}

function filterDistances(distances) {
    const outliers = [...new Set(outlier(distances).findOutliers())];
    const positions = findErrorPositions(distances, outliers);
    return distances
        .filter((distance, index) => positions.indexOf(index) === -1);
}

function transformTo3DPoints(distances, turnAngle) {
    let z = 0.0;
    let angle = 0;
    let radians = (Math.PI / 180.00) * turnAngle;
    let points = [];
    distances.forEach((distance) => {
        const x = Math.sin(angle) * distance;
        const y = Math.cos(angle) * distance;
        points.push({x: x, y: y, z: z});
        angle += radians;
    });
    return points;
}

exports.new = (req, res) => {
    if (!req.body.turnAngle || !req.body.distances) {
        return res.status(400).json({status: "error", error: 'Payload incomplete'});
    } else {
        const turnAngle = req.body.turnAngle;
        const distances = req.body.distances;
        const points = transformTo3DPoints(distances, turnAngle);

        const filtered = filterDistances(distances);
        const filteredPoints = transformTo3DPoints(filtered, turnAngle);

        let layer = new Layer({
            _id: mongoose.Types.ObjectId(),
            scan: req.body.scan_id,
            points: points,
            distances: distances,
            filteredDistances: filtered,
            filteredPoints: filteredPoints
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
    }
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