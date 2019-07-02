let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let describe = require('mocha').describe;
let should = chai.should();
let layer = require('../src/api/models/layer.model');
let scan = require('../src/api/models/scan.model');

chai.use(chaiHttp);

describe('Layer', () => {
    beforeEach((done) => {
        layer.deleteMany({}, (err) => {
            done();
        });
    });

    describe('/GET layer', () => {
        it('it should GET all the layers', (done) => {
            chai.request(server)
                .get('/layer')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.data.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST layer', () => {
        it('it should POST a new layer', (done) => {
            let newScan = new scan({name: "Dummy-scan"});
            newScan.save((err, scan) => {
                let newLayer = new layer({
                    _id: mongoose.Types.ObjectId(),
                    points: Array(10).fill({x: 0.5, y: 0.1, z: 0.3}),
                    distances: Array(10).fill(5),
                    'scan': scan.id,
                });
                chai.request(server)
                    .post(`/layer`)
                    .send(newLayer)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status');
                        res.body.status.should.be.eql('success');
                        should.exist(res.body.data.scan);
                        res.body.data.scan.should.be.eql(scan.id);
                        res.body.data.should.have.property('distances');
                        res.body.data.should.have.property('points');
                        res.body.data.distances.should.be.a('array');
                        res.body.data.points.should.be.a('array');
                        done();
                    });
            });
        });
    });

    describe('/DELETE layer', () => {
        it('it should DELETE the layer with the given id', (done) => {
            let newScan = new scan({name: "Dummy-scan"});
            newScan.save((err, scan) => {
                let newLayer = new layer({
                    _id: mongoose.Types.ObjectId(),
                    points: Array(10).fill({x: 0.5, y: 0.1, z: 0.3}),
                    distances: Array(10).fill(5),
                    'scan': scan.id,
                });
                newLayer.save((err, layer) => {
                    chai.request(server)
                        .delete(`/layer/${layer.id}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('status');
                            res.body.status.should.be.eql('success');
                            done();
                        });
                })
            });
        });
    });
});