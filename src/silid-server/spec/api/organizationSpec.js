const PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001;
const app = require('../../app');
const fixtures = require('sequelize-fixtures');
const models = require('../../models');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const stubJwks = require('../support/stubJwks');
const pem2jwk = require('pem-jwk').pem2jwk
const nock = require('nock');

/**
 * 2019-11-13
 * Sample tokens taken from:
 *
 * https://auth0.com/docs/api-auth/tutorials/adoption/api-tokens
 */
const _access = require('../fixtures/sample-auth0-access-token');
const _identity = require('../fixtures/sample-auth0-identity-token');

describe('organizationSpec', () => {

  let userinfoScope;
  let signedAccessToken, scope, pub, prv, keystore;
  beforeAll(done => {
    stubJwks((err, tokenAndScope) => {
      if (err) return done.fail(err);
      ({ signedAccessToken, scope, pub, prv, keystore } = tokenAndScope);
      userinfoScope = require('../support/userinfoStub')(signedAccessToken);
      done();
    });
  });

  let organization, agent;
  beforeEach(done => {
    models.sequelize.sync({force: true}).then(() => {
      fixtures.loadFile(`${__dirname}/../fixtures/agents.json`, models).then(() => {
        models.Agent.findAll().then(results => {
          agent = results[0];
          fixtures.loadFile(`${__dirname}/../fixtures/organizations.json`, models).then(() => {
            models.Organization.findAll().then(results => {
              organization = results[0];

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
          models.Organization.findAll().then(results => {
            expect(results.length).toEqual(1);

            request(app)
              .post('/organization')
              .send({
                name: 'One Book Canada' 
              })
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${signedAccessToken}`)
              .expect('Content-Type', /json/)
              .expect(201)
              .end(function(err, res) {
                if (err) done.fail(err);
                scope.done();
                expect(res.body.name).toEqual('One Book Canada');

                models.Organization.findAll().then(results => {
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
            .post('/organization')
            .send({
              name: organization.name 
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();
              expect(res.body.errors.length).toEqual(1);
              expect(res.body.errors[0].message).toEqual('That organization is already registered');
              done();
            });
        });
      });
  
      describe('read', () => {
        it('retrieves an existing record from the database', done => {
          request(app)
            .get(`/organization/${organization.id}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();
              expect(res.body.email).toEqual(organization.email);
              done();
            });
        });

        it('doesn\'t barf if record doesn\'t exist', done => {
          request(app)
            .get('/organization/33')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();
              expect(res.body.message).toEqual('No such organization');
              done();
            });
        });
      });
 
      describe('update', () => {
        it('updates an existing record in the database', done => {
          request(app)
            .put('/organization')
            .send({
              id: organization.id,
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
 
              models.Organization.findOne({ where: { id: organization.id }}).then(results => {
                expect(results.name).toEqual('Some Cool Guy');
                expect(results.email).toEqual(organization.email);
                done();
              }).catch(err => {
                done.fail(err);
              });
            });
        });

        it('doesn\'t barf if organization doesn\'t exist', done => {
          request(app)
            .put('/organization')
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
              expect(res.body.message).toEqual('No such organization');
              done();
            });
        });
      });

      describe('delete', () => {
        it('removes an existing record from the database', done => {
          request(app)
            .delete('/organization')
            .send({
              id: organization.id,
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();
              expect(res.body.message).toEqual('Organization deleted');
              done();
            });
        });

        it('doesn\'t barf if organization doesn\'t exist', done => {
          request(app)
            .delete('/organization')
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
              expect(res.body.message).toEqual('No such organization');
              done();
            });
        });
      });
    });

    describe('unauthorized', () => {

      let suspiciousToken;
      beforeEach(done => {
        suspiciousToken = jwt.sign({ ..._access, sub: 'auth0|888888' }, prv, { algorithm: 'RS256', expiresIn: '1h', header: { kid: keystore.all()[0].kid } });

        models.Agent.create({ email: 'suspiciousagent@example.com', accessToken: `Bearer ${suspiciousToken}` }).then(a => {
          done();
        }).catch(err => {
          done.fail(err);
        });
      });

      describe('update', () => {
        it('returns 401', done => {
          request(app)
            .put('/organization')
            .send({
              id: organization.id,
              name: 'Some Cool Guy'
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${suspiciousToken}`)
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();
              expect(res.body.message).toEqual('Unauthorized: Invalid token');
              done();
            });
        });

        it('does not change the record in the database', done => {
          request(app)
            .put('/organization')
            .send({
              id: organization.id,
              name: 'Some Cool Guy'
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${suspiciousToken}`)
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();
              models.Organization.findOne({ where: { id: organization.id }}).then(results => {
                expect(results.name).toEqual(organization.name);
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
            .delete('/organization')
            .send({
              id: organization.id
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${suspiciousToken}`)
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();
              expect(res.body.message).toEqual('Unauthorized: Invalid token');
              done();
            });
        });

        it('does not remove the record from the database', done => {
          models.Organization.findAll().then(results => {
            expect(results.length).toEqual(1);

            request(app)
              .delete('/organization')
              .send({
                id: organization.id
              })
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${suspiciousToken}`)
              .expect('Content-Type', /json/)
              .expect(401)
              .end(function(err, res) {
                if (err) done.fail(err);
                scope.done();
                models.Organization.findAll().then(results => {
                  expect(results.length).toEqual(1);
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

    it('returns 401 if provided an expired token', done => {
      let expiredToken = jwt.sign({ ..._access, iat: Math.floor(Date.now() / 1000) - (60 * 60) }, prv, { algorithm: 'RS256', expiresIn: '1h', header: { kid: keystore.all()[0].kid } });
      request(app)
        .get('/organization')
        .send({ name: 'Some org' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {
          if (err) done.fail(err);
          scope.done();
          expect(res.body.message).toEqual('jwt expired');
          done();
        });
    });

    it('returns 401 if provided no token', done => {
      request(app)
        .get('/organization')
        .send({ name: 'Some org' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {
          if (err) done.fail(err);
          expect(res.body.message).toEqual('No authorization token was found');
          done();
        });
    });
  });
});
