const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../src/app');
const should = require('chai').should();

chai.use(chaiHttp);

describe('Admin GET without authen', () => {
    it('should redirect `/admin/login` (302) GET /admin', (done) => {
        chai.request(server)
            .get('/admin')
            .redirects(0)
            .end((err, res) => {
                res.should.have.status(302);
                res.text.should.include('/admin/login');
                done();
            });
    });

    it('should return `/admin/login` (200) GET /admin/login', (done) => {
        chai.request(server)
            .get('/admin/login')
            .end((err, res) => {
                const expected = [
                    'Admin Control Panel',
                    'sign in start',
                    'admin panel',
                    'User Name',
                    'Password',
                ];
                const textLowerCase = res.text.toLowerCase();
                res.should.have.status(200);
                expected.map(async (expect) => {
                    textLowerCase.should.include(expect.toLowerCase());
                });
                done();
            });
    });

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

describe('Admin GET with authen', () => {
    let agent = chai.request(server);

    it('should redirect to `/admin/dashboard` (302) GET /admin', async () => {
        await agent
            .post('/admin/login')
            .send({
                _method: 'POST',
                user_name: 'tester',
                password: '1',
            })
            .then(async (res) => {
                res.status.should.be.equal(200);

                let textLowerCase = res.text.toLowerCase();
                const expected = [
                    'Admin Panel',
                    'tester0981354822',
                    'Dashboard',
                    'Log Out',
                    '/admin/signout',
                ];
                expected.map(async (expect) => {
                    textLowerCase.should.include(expect.toLowerCase());
                });
            });
    });
});
