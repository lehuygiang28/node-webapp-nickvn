const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../src/app');
const should = require('chai').should();

chai.use(chaiHttp);
let agent = chai.request(server);

describe('POST to /admin/login', () => {
    it('should redirect to `/admin/login` (302) GET /admin', async () => {
        await agent
            .post('/admin/login')
            .send({
                _method: 'POST',
                user_name: 'tester',
                password: '',
            })
            .then(async (res) => {
                res.status.should.be.equal(401);
            });
    });
});
