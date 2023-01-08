const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../src/app');
const www = require('../../bin/www');
const should = require('chai').should();

chai.use(chaiHttp);

describe('TEST login request POST', function () {
    let agent = chai.request.agent(server);

    /**
     * POST a request to login
     */
    it('should return /dang-nhap with error (401) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                // Wrong password
                _method: 'POST',
                username: 'tester',
                password: '2',
            })
            .then(async (res) => {
                // console.log(res);
                // console.log(res.header['set-cookie']);
                res.status.should.be.equal(401);
                [
                    'đăng ký',
                    'đăng nhập',
                    'đăng nhập hệ thống',
                    'Tài khoản hoặc mật khẩu không chính xác !',
                ].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });

    it('should return /dang-nhap with error (401) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                // Wrong username & password
                _method: 'POST',
                username: 'this-not-a-user-name',
                password: 'not-a-password',
            })
            .then(async (res) => {
                res.status.should.be.equal(401);
                [
                    'đăng ký',
                    'đăng nhập',
                    'đăng nhập hệ thống',
                    'Tài khoản hoặc mật khẩu không chính xác !',
                ].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });

    it('should return /dang-nhap with error (401) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                // No input a password
                _method: 'POST',
                username: 'this-not-a-user-name',
            })
            .then(async (res) => {
                res.status.should.be.equal(401);
                [
                    'đăng ký',
                    'đăng nhập',
                    'đăng nhập hệ thống',
                    'Tài khoản hoặc mật khẩu không chính xác !',
                ].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });

    it('should return /dang-nhap with error (401) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                // No input username
                _method: 'POST',
                password: 'not-a-password',
            })
            .then(async (res) => {
                res.status.should.be.equal(401);
                [
                    'đăng ký',
                    'đăng nhập',
                    'đăng nhập hệ thống',
                    'Tài khoản hoặc mật khẩu không chính xác !',
                ].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });

    it('should return /dang-nhap with error (401) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                // User name is empty
                _method: 'POST',
                username: '',
                password: 'not-a-password',
            })
            .then(async (res) => {
                res.status.should.be.equal(401);
                [
                    'đăng ký',
                    'đăng nhập',
                    'đăng nhập hệ thống',
                    'Tài khoản hoặc mật khẩu không chính xác !',
                ].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });

    it('should return /dang-nhap with error (401) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                // Password is empty
                _method: 'POST',
                username: 'this-not-a-user-name',
                password: '',
            })
            .then(async (res) => {
                res.status.should.be.equal(401);
                [
                    'đăng ký',
                    'đăng nhập',
                    'đăng nhập hệ thống',
                    'Tài khoản hoặc mật khẩu không chính xác !',
                ].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });

    it('should return /dang-nhap with error (401) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                // Password is empty with real username
                _method: 'POST',
                username: 'tester',
                password: '',
            })
            .then(async (res) => {
                res.status.should.be.equal(401);
                [
                    'đăng ký',
                    'đăng nhập',
                    'đăng nhập hệ thống',
                    'Tài khoản hoặc mật khẩu không chính xác !',
                ].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });

    it('should return /dang-nhap with error (401) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                // Try to XSS attack in username
                _method: 'POST',
                username: "<script>alert('hihi1245')</script>",
                password: 'not-a-password',
            })
            .then(async (res) => {
                res.status.should.be.equal(401);
                [
                    'đăng ký',
                    'đăng nhập',
                    'đăng nhập hệ thống',
                    'Tài khoản hoặc mật khẩu không chính xác !',
                ].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });

    it('should return /dang-nhap with error (401) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                // Try XSS attack in password
                _method: 'POST',
                username: 'this-not-a-user-name',
                password: "<script>alert('hihi1245')</script>",
            })
            .then(async (res) => {
                res.status.should.be.equal(401);
                [
                    'đăng ký',
                    'đăng nhập',
                    'đăng nhập hệ thống',
                    'Tài khoản hoặc mật khẩu không chính xác !',
                ].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });

    it('should return /dang-nhap with error (401) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                // Try XSS attack in password with real username
                _method: 'POST',
                username: 'tester',
                password: "<script>alert('hihi1245')</script>",
            })
            .then(async (res) => {
                res.status.should.be.equal(401);
                [
                    'đăng ký',
                    'đăng nhập',
                    'đăng nhập hệ thống',
                    'Tài khoản hoặc mật khẩu không chính xác !',
                ].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });

    it('should return /dang-nhap with error (401) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                // Try input number in username
                _method: 'POST',
                username: 123566,
                password: "<script>alert('hihi1245')</script>",
            })
            .then(async (res) => {
                res.status.should.be.equal(401);
                [
                    'đăng ký',
                    'đăng nhập',
                    'đăng nhập hệ thống',
                    'Tài khoản hoặc mật khẩu không chính xác !',
                ].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });

    it('should return /dang-nhap with error (401) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                // Try input number in password with wrong info
                _method: 'POST',
                username: 'this-not-a-user',
                password: 123456,
            })
            .then(async (res) => {
                res.status.should.be.equal(401);
                [
                    'đăng ký',
                    'đăng nhập',
                    'đăng nhập hệ thống',
                    'Tài khoản hoặc mật khẩu không chính xác !',
                ].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });

    it('should return /dang-nhap with error (401) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                // Try input password as undefined with real username
                _method: 'POST',
                username: 'tester',
                password: undefined,
            })
            .then(async (res) => {
                res.status.should.be.equal(401);
                [
                    'đăng ký',
                    'đăng nhập',
                    'đăng nhập hệ thống',
                    'Tài khoản hoặc mật khẩu không chính xác !',
                ].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });

    it('should return /dang-nhap with error (401) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                // Try input password as undefined
                _method: 'POST',
                username: 'this-not-a-user',
                password: undefined,
            })
            .then(async (res) => {
                res.status.should.be.equal(401);
                [
                    'đăng ký',
                    'đăng nhập',
                    'đăng nhập hệ thống',
                    'Tài khoản hoặc mật khẩu không chính xác !',
                ].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });

    it('should return success with cookie (200) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                /**
                 * Try input correctly username and password, but password is number, not string
                 * Should login successfully, because number will be converted to string
                 */
                _method: 'POST',
                username: 'tester',
                password: 1,
            })
            .then(async (res) => {
                res.status.should.be.equal(200);
                ['đăng xuất', 'tester'].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });
});
