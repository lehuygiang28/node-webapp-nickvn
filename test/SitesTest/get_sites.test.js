const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../src/app');
const should = require('chai').should();

chai.use(chaiHttp);

// GET / without authentication login
describe('Sites GET request', function () {
    it('should return a home page (200) GET /', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    });

    it('should return a login page (200) GET /dang-nhap', (done) => {
        chai.request(server)
            .get('/dang-nhap')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    });

    it('should return a signup page (200) GET /dang-ky', (done) => {
        chai.request(server)
            .get('/dang-ky')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    });

    it('should redirect / (home page) (302) GET /dang-xuat', (done) => {
        chai.request(server)
            .get('/dang-xuat')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(302);
                res.text.toLowerCase().should.include('/?sout=false');
                done();
            });
    });

    it('should redirect / (home page) (404) GET /this-not-exists-in-server', (done) => {
        chai.request(server)
            .get('/this-not-exists-in-server')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(404);
                res.text.toLowerCase().should.include('error 404');
                done();
            });
    });
});
