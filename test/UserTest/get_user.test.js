const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../src/app');
const should = require('chai').should();

chai.use(chaiHttp);

// GET /user without authentication login
describe('User GET request', function() {
    it('should redirect /dang-nhap when trying to access /user (303)', (done) => {
        chai.request(server)
            .get('/user')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(303);
                res.text.should.include('/dang-nhap');
                done();
            });
    });

    it('should redirect /dang-nhap when trying to access /user/thong-tin-tai-khoan (303)', (done) => {
        chai.request(server)
            .get('/user/thong-tin-tai-khoan')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(303);
                res.text.should.include('/dang-nhap');
                done();
            });
    });

    it('should redirect /dang-nhap when trying to access /user/doi-mat-khau (303)', (done) => {
        chai.request(server)
            .get('/user/doi-mat-khau')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(303);
                res.text.should.include('/dang-nhap');
                done();
            });
    });

    it('should redirect /dang-nhap when trying to access /user/tai-khoan-da-mua (303)', (done) => {
        chai.request(server)
            .get('/user/tai-khoan-da-mua')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(303);
                res.text.should.include('/dang-nhap');
                done();
            });
    });

    it('should redirect /dang-nhap when trying to access /user/gui-lai-tai-khoan (303)', (done) => {
        chai.request(server)
            .get('/user/gui-lai-tai-khoan')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(303);
                res.text.should.include('/dang-nhap');
                done();
            });
    });

});