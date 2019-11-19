const PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001;
const app = require('../../app');
const fixtures = require('sequelize-fixtures');
const models = require('../../models');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const nock = require('nock');
const stubJwks = require('../support/stubJwks');

describe('agentSpec', () => {

  /**
   * 2019-11-13
   * Sample tokens taken from:
   *
   * https://auth0.com/docs/api-auth/tutorials/adoption/api-tokens
   */
  const _access = require('../fixtures/sample-auth0-access-token');
  const _identity = require('../fixtures/sample-auth0-identity-token');

  const pem2jwk = require('pem-jwk').pem2jwk

  let signedAccessToken, scope, pub, prv, keystore;
  beforeAll(done => {
    stubJwks((err, tokenAndScope) => {
      if (err) return done.fail(err);
      ({ signedAccessToken, scope, pub, prv, keystore } = tokenAndScope);
      done();
    });
  });

  let agent;
  beforeEach(done => {
    models.sequelize.sync({force: true}).then(() => {
      fixtures.loadFile(`${__dirname}/../fixtures/agents.json`, models).then(() => {
        models.Agent.findAll().then(results => {
          agent = results[0];

          // This agent has recently returned for a visit
          agent.accessToken = `Bearer ${signedAccessToken}`;
          agent.save().then(() => {
            done();
          }).catch(err => {
            done.fail(err);
          });
        });
      }).catch(err => {
        done.fail(err);
      });
    }).catch(err => {
      done.fail(err);
    });
  });

  describe('authenticated', () => {

    describe('authorized', () => {

      describe('create', () => {
        it('adds a new record to the database', done => {
          models.Agent.findAll().then(results => {
            expect(results.length).toEqual(1);

            request(app)
              .post('/agent')
              .send({
                email: 'someotherguy@example.com' 
              })
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${signedAccessToken}`)
              .expect('Content-Type', /json/)
              .expect(201)
              .end(function(err, res) {
                if (err) return done.fail(err);
                scope.done();

                expect(res.body.email).toEqual('someotherguy@example.com');

                models.Agent.findAll().then(results => {
                  expect(results.length).toEqual(2);
                  done();
                }).catch(err => {
                  done.fail(err);
                });
              });
          }).catch(err => {
            done.fail(err);
          });
        });

        it('returns an error if record already exists', done => {
          request(app)
            .post('/agent')
            .send({
              email: agent.email 
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();

              expect(res.body.errors.length).toEqual(1);
              expect(res.body.errors[0].message).toEqual('That agent is already registered');
              done();
            });
        });
      });
  
      describe('read', () => {
        it('retrieves an existing record from the database', done => {
          request(app)
            .get(`/agent/${agent.id}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();

              expect(res.body.email).toEqual(agent.email);
              done();
            });
        });

        it('doesn\'t barf if record doesn\'t exist', done => {
          request(app)
            .get('/agent/33')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();

              expect(res.body.message).toEqual('No such agent');
              done();
            });
        });
      });
 
      describe('update', () => {
        it('updates an existing record in the database', done => {
          request(app)
            .put('/agent')
            .send({
              id: agent.id,
              name: 'Some Cool Guy'
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();

              expect(res.body.name).toEqual('Some Cool Guy');
 
              models.Agent.findOne({ where: { id: agent.id }}).then(results => {
                expect(results.name).toEqual('Some Cool Guy');
                expect(results.email).toEqual(agent.email);
                done();
              }).catch(err => {
                done.fail(err);
              });
            });
        });

        it('doesn\'t barf if agent doesn\'t exist', done => {
          request(app)
            .put('/agent')
            .send({
              id: 111,
              name: 'Some Guy' 
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();

              expect(res.body.message).toEqual('No such agent');
              done();
            });
        });
      });

      describe('delete', () => {
        it('removes an existing record from the database', done => {
          request(app)
            .delete('/agent')
            .send({
              id: agent.id,
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();

              expect(res.body.message).toEqual('Agent deleted');
              done();
            });
        });

        it('doesn\'t barf if agent doesn\'t exist', done => {
          request(app)
            .delete('/agent')
            .send({
              id: 111,
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();

              expect(res.body.message).toEqual('No such agent');
              done();
            });
        });
      });
    });

    describe('unauthorized', () => {

      let suspiciousHeader, suspiciousToken;
      beforeEach(done => {

        let jwkPub = pem2jwk(pub);
        jwkPub.use = 'sig';
        jwkPub.alg = 'RS256';
  
        keystore.add(jwkPub, 'pkcs8').then(function(result) {
          suspiciousToken = jwt.sign({ sub: 'somethingdifferent', ..._access}, prv, { algorithm: 'RS256', expiresIn: '1h', header: { kid: result.kid } });

          const newTokenScope = nock(`https://${process.env.AUTH0_DOMAIN}`, {
              reqheaders: {
                'Authorization': `Bearer ${suspiciousToken}`
              }
            })
            .get('/userinfo')
            .reply(200, { email: 'suspiciousagent@example.com', ..._identity });

          models.Agent.create({ email: 'suspiciousagent@example.com', accessToken: `Bearer ${suspiciousToken}` }).then(a => {
            done();
          }).catch(err => {
            done.fail(err);
          });

        }).catch(err => {
          done.fail(err);
        });
      });

      describe('update', () => {
        it('returns 401', done => {
          request(app)
            .put('/agent')
            .send({
              id: agent.id,
              name: 'Some Cool Guy'
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${suspiciousToken}`)
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function(err, res) {
              if (err) return done.fail(err);
              expect(res.body.message).toEqual('Unauthorized: Invalid token');
              done();
            });
        });

        it('does not change the record in the database', done => {
          request(app)
            .put('/agent')
            .send({
              id: agent.id,
              name: 'Some Cool Guy'
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${suspiciousToken}`)
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function(err, res) {
              if (err) done.fail(err);
              models.Agent.findOne({ where: { id: agent.id }}).then(results => {
                expect(results.name).toEqual('Some Guy');
                expect(results.email).toEqual(agent.email);
                done();
              }).catch(err => {
                done.fail(err);
              });
            });
        });
      });

      describe('delete', () => {
        it('returns 401', done => {
          request(app)
            .delete('/agent')
            .send({
              id: agent.id
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${suspiciousToken}`)
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function(err, res) {
              if (err) done.fail(err);
                expect(res.body.message).toEqual('Unauthorized: Invalid token');
                done();
              });
        });

        it('does not remove the record from the database', done => {
          models.Agent.findAll().then(results => {
            expect(results.length).toEqual(2);

            request(app)
              .delete('/agent')
              .send({
                id: agent.id
              })
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${suspiciousToken}`)
              .expect('Content-Type', /json/)
              .expect(401)
              .end(function(err, res) {
                if (err) done.fail(err);
                models.Agent.findAll().then(results => {
                  expect(results.length).toEqual(2);
                  done();
                }).catch(err => {
                  done.fail(err);
                });
              });
          }).catch(err => {
            done.fail(err);
          });
        });
      });
    });
  });

  describe('not authenticated', () => {

    let expiredToken;
    beforeAll(done => {
      let jwkPub = pem2jwk(pub);
      jwkPub.use = 'sig';
      jwkPub.alg = 'RS256';

      keystore.add(jwkPub, 'pkcs8').then(function(result) {
        expiredToken = jwt.sign({ iat: Math.floor(Date.now() / 1000) - (60 * 60), ..._access }, prv, { algorithm: 'RS256', expiresIn: '1h', header: { kid: result.kid } });
        done();
      }).catch(err => {
        done.fail(err);
      });
    });

    it('returns 401 if provided an expired token', done => {
      request(app)
        .get('/agent')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {
          if (err) return done.fail(err);
          scope.done();

          expect(res.body.message).toEqual('jwt expired');
          done();
        });
    });

    it('returns 401 if provided no token', done => {
      request(app)
        .get('/agent')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {
          if (err) return done.fail(err);
          scope.done();

          expect(res.body.message).toEqual('No authorization token was found');
          done();
        });
    });
  });
});
