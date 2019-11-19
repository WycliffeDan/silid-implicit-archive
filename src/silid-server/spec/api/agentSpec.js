const PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001;
const app = require('../../app');
const fixtures = require('sequelize-fixtures');
const models = require('../../models');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const nock = require('nock');

describe('agentSpec', () => {

  /**
   * 2019-11-13
   * Sample tokens taken from:
   *
   * https://auth0.com/docs/api-auth/tutorials/adoption/api-tokens
   */
  const _access = require('../fixtures/sample-auth0-access-token');

  const pem2jwk = require('pem-jwk').pem2jwk

  const NodeRSA = require('node-rsa');
  const key = new NodeRSA({b: 512, e: 5});

  key.setOptions({
    encryptionScheme: {
      scheme: 'pkcs1',
      label: 'Optimization-Service'
    },
//    signingScheme: 'pkcs1'
//    signingScheme: {
//      saltLength: 25
//    }
  });
  
  const prv = key.exportKey('pkcs1-private-pem');
  const pub = key.exportKey('pkcs8-public-pem');

  const jose = require('node-jose');
  
  const keystore = jose.JWK.createKeyStore();

  let signedAccessToken, scope;
  beforeAll(done => {
    let jwkPub = pem2jwk(pub);
    jwkPub.use = 'sig';
    jwkPub.alg = 'RS256';

    keystore.add(jwkPub, 'pkcs8').then(function(result) {
//      result.use = 'sig';
      signedAccessToken = jwt.sign(_access, prv, { algorithm: 'RS256', header: { kid: result.kid } });

      scope = nock(`https://${process.env.AUTH0_DOMAIN}`)
        .persist()
        .log(console.log)
        .get('/.well-known/jwks.json')
        .reply(200, keystore);

      done();
    }).catch(err => {
      done.fail(err);
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

//    let scope;
//    beforeEach(done => {
//      console.log('ADDING KEY TO STORE', pub);
//      let jwkPub = pem2jwk(pub);
//      jwkPub.use = 'sig';
//      jwkPub.alg = 'RS256';
//
//      keystore.add(jwkPub, 'pkcs8').then(function(result) {
//        result.use = 'sig';
//        console.log('\n\n\n\nRESULT');
//        console.log(result);
//
//        scope = nock(`https://${process.env.AUTH0_DOMAIN}`)
////          .persist()
//          .log(console.log)
//          .get('/.well-known/jwks.json')
//          //.reply(200, JSON.stringify(keystore));
//          .reply(200, keystore);
//
//        done();
//      }).catch(err => {
//        console.log('EROR',err);
//        done.fail(err);
//      });
//    });

    afterEach(() => {
      nock.cleanAll();
    });

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
//
//      let suspicousHeader;
//      beforeEach(done => {
//        suspicousHeader = `Bearer ${jwt.sign({ sub: 'somethingdifferent', ..._access}, process.env.CLIENT_SECRET, { expiresIn: '1h' })}`;
//
//        const newTokenScope = nock(`https://${process.env.AUTH0_DOMAIN}`, {
//            reqheaders: {
//              'Authorization': suspicousHeader
//            }
//          })
//          .get('/userinfo')
//          .reply(200, { email: 'suspiciousagent@example.com', ..._identity });
//
//
//        models.Agent.create({ email: 'suspiciousagent@example.com', accessToken: suspicousHeader }).then(a => {
//          done();
//        }).catch(err => {
//          done.fail(err);
//        });
//      });
//
//      describe('update', () => {
//        it('returns 401', done => {
//          request(app)
//            .put('/agent')
//            .send({
//              id: agent.id,
//              name: 'Some Cool Guy'
//            })
//            .set('Accept', 'application/json')
//            .set('Authorization', suspicousHeader)
//            .expect('Content-Type', /json/)
//            .expect(401)
//            .end(function(err, res) {
//              if (err) return done.fail(err);
//              expect(res.body.message).toEqual('Unauthorized: Invalid token');
//              done();
//            });
//        });
//
//        it('does not change the record in the database', done => {
//          request(app)
//            .put('/agent')
//            .send({
//              id: agent.id,
//              name: 'Some Cool Guy'
//            })
//            .set('Accept', 'application/json')
//            .set('Authorization', suspicousHeader)
//            .expect('Content-Type', /json/)
//            .expect(401)
//            .end(function(err, res) {
//              if (err) done.fail(err);
//              models.Agent.findOne({ where: { id: agent.id }}).then(results => {
//                expect(results.name).toEqual('Some Guy');
//                expect(results.email).toEqual(agent.email);
//                done();
//              }).catch(err => {
//                done.fail(err);
//              });
//            });
//        });
//      });
//
//      describe('delete', () => {
//        it('returns 401', done => {
//          request(app)
//            .delete('/agent')
//            .send({
//              id: agent.id
//            })
//            .set('Accept', 'application/json')
//            .set('Authorization', suspicousHeader)
//            .expect('Content-Type', /json/)
//            .expect(401)
//            .end(function(err, res) {
//              if (err) done.fail(err);
//                expect(res.body.message).toEqual('Unauthorized: Invalid token');
//                done();
//              });
//        });
//
//        it('does not remove the record from the database', done => {
//          models.Agent.findAll().then(results => {
//            expect(results.length).toEqual(2);
//
//            request(app)
//              .delete('/agent')
//              .send({
//                id: agent.id
//              })
//              .set('Accept', 'application/json')
//              .set('Authorization', suspicousHeader)
//              .expect('Content-Type', /json/)
//              .expect(401)
//              .end(function(err, res) {
//                if (err) done.fail(err);
//                models.Agent.findAll().then(results => {
//                  expect(results.length).toEqual(2);
//                  done();
//                }).catch(err => {
//                  done.fail(err);
//                });
//              });
//          }).catch(err => {
//            done.fail(err);
//          });
//        });
//      });
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
