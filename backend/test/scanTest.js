let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let describe = require('mocha').describe;
let should = chai.should();
let scan = require('../src/api/models/scan.model');

chai.use(chaiHttp);
//Our parent block
describe('Scan', () => {
    beforeEach((done) => { //Before each test we empty the database
        scan.deleteMany({}, (err) => {
            done();
        });
    });

    describe('/GET scan', () => {
        it('it should GET all the scans', (done) => {
            chai.request(server)
                .get('/scan')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.should.be.a('array');
                    res.body.data.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST scan', () => {
        it('it should POST a new scan', (done) => {
            let newScan = {name: 'POST-Scan'};
            chai.request(server)
                .post('/scan')
                .send(newScan)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.data.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.status.should.be.eql('success');
                    res.body.data._id.should.exist;
                    res.body.data.name.should.be.eql('POST-Scan');
                    done();
                });
        });
    });

    describe('/GET/:scan_id', () => {
        it('it should GET a scan by the given id', (done) => {
            let newScan = new scan({name: "GET-scan-by-id"});
            newScan.save((err, scan) => {
                chai.request(server)
                    .get(`/scan/${scan._id}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status');
                        res.body.status.should.be.eql('success');
                        res.body.data.scan._id.should.exist;
                        res.body.data.scan._id.should.be.eql(scan.id);
                        res.body.data.should.have.property('layers');
                        res.body.data.layers.should.be.a('array');
                        done();
                    });
            });
        });
        it('it should GET a scan with a correct id structure, but does not exist', (done) => {
            chai.request(server)
                .get(`/scan/5d19c09cae953224e8705835`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status');
                    res.body.status.should.be.eql('success');
                    should.equal(res.body.data.scan, null);
                    res.body.data.should.have.property('layers');
                    res.body.data.layers.should.be.a('array');
                    done();
                });
        });
    });

    describe('/DELETE scan', () => {
        it('it should DELETE the scan with the given id', (done) => {
            let newScan = new scan({name: "DELETE-Scan"});
            newScan.save((err, scan) => {
                chai.request(server)
                    .delete(`/scan/${scan._id}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status');
                        res.body.status.should.be.eql('success');
                        done();
                    });
            });
        });
    });
});