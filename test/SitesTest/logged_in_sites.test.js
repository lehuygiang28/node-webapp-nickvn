const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../src/app');
const www = require('../../bin/www');
const should = require('chai').should();

chai.use(chaiHttp);

describe('Login Success', function () {
    let agent = chai.request.agent(server);

    it('should return cookie on success (200) POST /dang-nhap', async function () {
        await agent
            .post('/dang-nhap')
            .send({
                // Correct user
                _method: 'POST',
                username: 'admin',
                password: '1',
            })
            .then(async (res) => {
                // console.log(res.text);
                // console.log(res.header['set-cookie']);

                res.status.should.be.equal(200);

                ['đăng xuất', 'admin'].map((expect) => {
                    res.text.toLowerCase().should.include(expect.toLowerCase());
                });
            });
    });

    /**
     * The `agent` now has the sessionid cookie saved, and will send it
     * back to the server in the next request:
     */
    it('should return page with cookie on success (200) GET /user', async function () {
        await agent.get('/user').then(async (res) => {
            res.should.have.status(200);

            // _id, userName
            ['admin', '63a1cad3ca0c2ffea515c453'].map((expect) => {
                res.text.toLowerCase().should.include(expect.toLowerCase());
            });
        });
    });

    it('should return page with cookie on success (200) GET /user/thong-tin-tai-khoan', async function () {
        await agent.get('/user/thong-tin-tai-khoan').then(async (res) => {
            res.should.have.status(200);
            // UserName
            res.text.toLowerCase().should.include('admin');
            // _id
            res.text.toLowerCase().should.include('63a1cad3ca0c2ffea515c453');
        });
    });

    it('should return 200 with cookie on success GET /user/thong-tin-tai-khoan', async function () {
        await agent.get('/user/thong-tin-tai-khoan').then(async (res) => {
            res.should.have.status(200);
            // UserName
            res.text.toLowerCase().should.include('admin');
            // _id
            res.text.toLowerCase().should.include('63a1cad3ca0c2ffea515c453');
        });
    });
});
