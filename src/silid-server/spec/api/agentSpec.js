const PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001;
const app = require('../../app');
const fixtures = require('sequelize-fixtures');
const models = require('../../models');
const jwt = require('jsonwebtoken');
const request = require('supertest');

describe('agentSpec', () => {

  let agent;
  beforeEach(done => {
    models.sequelize.sync({force: true}).then(() => {
      fixtures.loadFile(`${__dirname}/../fixtures/agents.json`, models).then(() => {
        models.Agent.findAll().then(results => {
          agent = results[0];
          done();
        });
      }).catch(err => {
        done.fail(err);
      });
    }).catch(err => {
      done.fail(err);
    });
  });

  describe('authenticated', () => {

    let token;
    beforeEach(done => {
      token = jwt.sign({ email: agent.email, iat: Math.floor(Date.now()) }, process.env.SECRET, { expiresIn: '1h' });
      done();
    });

    describe('authorized', () => {
  
    });

    describe('unauthorized', () => {
  
    });
  });

  describe('not authenticated', () => {
    it('returns 401 if provided an expired token', done => {
      const expiredToken = jwt.sign({ email: agent.email, iat: Math.floor(Date.now() / 1000) - (60 * 60) }, process.env.SECRET, { expiresIn: '1h' });
      request(app)
        .get('/agent')
        .send({ token: expiredToken})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {
          if (err) done.fail(err);
            expect(res.body.message).toEqual('Unauthorized: Invalid token');
            done();
          });
    });

    it('returns 401 if provided no token', done => {
      request(app)
        .get('/agent')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {
          if (err) done.fail(err);
            expect(res.body.message).toEqual('Unauthorized: No token provided');
            done();
          });
    });
  });
});
