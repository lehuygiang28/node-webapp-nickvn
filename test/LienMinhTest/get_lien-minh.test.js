const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../src/app');
const should = require('chai').should();

chai.use(chaiHttp);

// GET /lien-minh without authentication login
describe('LienMinh GET request', function() {

    it('should return a categories page (200) GET /lien-minh', done => {
        chai.request(server)
            .get('/lien-minh')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                res.text.should.include('/lien-minh');
                done();
            });
    })

    it('should return a products page (200) GET /lien-minh/acc-lien-minh', done => {
        chai.request(server)
            .get('/lien-minh/acc-lien-minh')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.include('/lien-minh/acc-lien-minh');
                done();
            });
    })

    it('should return a product details (200) GET /lien-minh/acc-lien-minh/13', done => {
        chai.request(server)
            .get('/lien-minh/acc-lien-minh/13')
            // .redirects(0)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.text.should.include('Tài khoản liên minh số #13');
                done();
            });
    })

    it('should redirect `/lien-minh` (303) GET /lien-minh/acc-lien-minh/15', done => {
        chai.request(server)
            .get('/lien-minh/acc-lien-minh/15')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(303);
                res.body.should.be.a('object');
                res.text.should.include('/lien-minh');
                done();
            });
    })

    it('should redirect `/lien-minh` (303) GET /lien-minh/acc-lien-minh/this-should-be-a-number', done => {
        chai.request(server)
            .get('/lien-minh/acc-lien-minh/this-should-be-a-number')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(303);
                res.body.should.be.a('object');
                res.text.should.include('/lien-minh');
                done();
            });
    })

    it('should redirect `/lien-minh` (303) GET /lien-minh/acc-lien-minh/@!@#123', done => {
        chai.request(server)
            .get('/lien-minh/acc-lien-minh/@!@#123')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(303);
                res.body.should.be.a('object');
                res.text.should.include('/lien-minh');
                done();
            });
    })

    it('should return `404 Not Found` (404) GET /lien-minh/acc-lien-minh/<script>alert()</script>', done => {
        chai.request(server)
            .get('/lien-minh/acc-lien-minh/<script>alert()</script>')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(404);
                res.text.should.include('404');
                done();
            });
    })

    it('should redirect `/lien-minh/acc-lien-minh` (303) GET /lien-minh/acc-lien-minh/13/buy', done => {
        chai.request(server)
            .get('/lien-minh/acc-lien-minh/13/buy')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(303);
                res.text.should.include('/lien-minh/acc-lien-minh');
                done();
            });
    })

    it('should redirect `/lien-minh/acc-lien-minh` (303) GET /lien-minh/acc-lien-minh/15/buy', done => {
        chai.request(server)
            .get('/lien-minh/acc-lien-minh/15/buy')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(303);
                res.text.should.include('/lien-minh/acc-lien-minh');
                done();
            });
    })

    it('should redirect `/lien-minh/acc-lien-minh` (303) GET /lien-minh/acc-lien-minh/should-is-number/buy', done => {
        chai.request(server)
            .get('/lien-minh/acc-lien-minh/should-is-number/buy')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(303);
                res.text.should.include('/lien-minh/acc-lien-minh');
                done();
            });
    })

    it('should redirect `/lien-minh/acc-lien-minh` (404) GET /lien-minh/acc-lien-minh/<script>alert()</script>/buy', done => {
        chai.request(server)
            .get('/lien-minh/acc-lien-minh/<script>alert()</script>/buy')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(404);
                res.text.should.include('404');
                done();
            });
    })

});