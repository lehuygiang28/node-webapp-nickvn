const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../src/app');
const should = require('chai').should();

chai.use(chaiHttp);

describe('Admin GET', () => {
    it('should redirect `/admin/login` (302) GET /admin', (done) => {
        chai.request(server)
            .get('/admin')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(302);
                res.text.should.include('/admin/login');
                done();
            });
    })

    it('should return `/admin/login` (200) GET /admin/login', (done) => {
        chai.request(server)
            .get('/admin/login')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.toLowerCase().should.include('sign in start');
                done();
            });
    })

    it('should redirect to /admin/login (302) GET /admin/signout', (done) => {
        chai.request(server)
            .get('/admin/signout')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(302);
                res.text.toLowerCase().should.include('/admin/login');
                done();
            });
    });

});