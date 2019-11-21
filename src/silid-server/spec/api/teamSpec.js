const PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001;
const app = require('../../app');
const fixtures = require('sequelize-fixtures');
const models = require('../../models');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const nock = require('nock')
const stubJwks = require('../support/stubJwks');
const NodeRSA = require('node-rsa');

/**
 * 2019-11-13
 * Sample tokens taken from:
 *
 * https://auth0.com/docs/api-auth/tutorials/adoption/api-tokens
 */
const _access = require('../fixtures/sample-auth0-access-token');
const _identity = require('../fixtures/sample-auth0-identity-token');

describe('teamSpec', () => {

  let signedAccessToken, scope, pub, prv, keystore;
  beforeAll(done => {
    stubJwks((err, tokenAndScope) => {
      if (err) return done.fail(err);
      ({ signedAccessToken, scope, pub, prv, keystore } = tokenAndScope);

      done();
    });
  });


  let team, organization, agent;
  beforeEach(done => {
    models.sequelize.sync({force: true}).then(() => {
      fixtures.loadFile(`${__dirname}/../fixtures/agents.json`, models).then(() => {
        models.Agent.findAll().then(results => {
          agent = results[0];
          fixtures.loadFile(`${__dirname}/../fixtures/organizations.json`, models).then(() => {
            models.Organization.findAll().then(results => {
              organization = results[0];
              fixtures.loadFile(`${__dirname}/../fixtures/teams.json`, models).then(() => {
                models.Team.findAll().then(results => {
                  team = results[0];

                  // This agent has recently returned for a visit
                  agent.accessToken = `Bearer ${signedAccessToken}`;
                  agent.save().then(() => {
                    done();
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
        it('allows organization creator to add a new record to the database', done => {
          organization.getCreator().then(creator => {
            expect(creator.email).toEqual(agent.email);

            models.Team.findAll().then(results => {
              expect(results.length).toEqual(1);

              request(app)
                .post('/team')
                .send({
                  organizationId: organization.id,
                  name: 'Tsuutina Translation'
                })
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${signedAccessToken}`)
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function(err, res) {
                  if (err) done.fail(err);
                  scope.done();
                  expect(res.body.name).toEqual('Tsuutina Translation');

                  models.Team.findAll().then(results => {
                    expect(results.length).toEqual(2);
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

        it('allows organization member to add a new record to the database', done => {
          const newMemberToken = jwt.sign({ ..._access, sub: 'auth0|888888' }, prv, { algorithm: 'RS256', expiresIn: '1h', header: { kid: keystore.all()[0].kid } });

          let memberAgent = new models.Agent({ email: 'member-agent@example.com', accessToken: `Bearer ${newMemberToken}` });
          memberAgent.save().then(results => {
            memberAgent.addOrganization(organization).then(results => {
              models.Team.findAll().then(results => {
                expect(results.length).toEqual(1);
                request(app)
                  .post('/team')
                  .send({
                    organizationId: organization.id,
                    name: 'Tsuutina Translation'
                  })
                  .set('Accept', 'application/json')
                  .set('Authorization', `Bearer ${newMemberToken}`)
                  .expect('Content-Type', /json/)
                  .expect(201)
                  .end(function(err, res) {
                    if (err) done.fail(err);
                    scope.done();

                    expect(res.body.name).toEqual('Tsuutina Translation');

                    models.Team.findAll().then(results => {
                      expect(results.length).toEqual(2);
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
        });

        it('returns an error if record already exists', done => {
          request(app)
            .post('/team')
            .send({
              organizationId: organization.id, 
              name: team.name 
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();
              expect(res.body.errors.length).toEqual(1);
              expect(res.body.errors[0].message).toEqual('That team is already registered');
              done();
            });
        });
      });

      describe('read', () => {
        it('retrieves an existing record from the database', done => {
          request(app)
            .get(`/team/${team.id}`)
            .send({ name: 'My team' })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();
              expect(res.body.email).toEqual(team.email);
              done();
            });
        });

        it('doesn\'t barf if record doesn\'t exist', done => {
          request(app)
            .get('/team/33')
            .send({ name: 'My team' })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();
              expect(res.body.message).toEqual('No such team');
              done();
            });
        });
      });
 
      describe('update', () => {
        it('allows an organization creator to update an existing record in the database', done => {
          organization.getCreator().then(creator => {
            expect(creator.email).toEqual(agent.email);
            expect(team.organizationId).toEqual(organization.id);

            request(app)
              .put('/team')
              .send({
                id: team.id,
                name: 'Tsuutina Mark Translation'
              })
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${signedAccessToken}`)
              .expect('Content-Type', /json/)
              .expect(201)
              .end(function(err, res) {
                if (err) done.fail(err);
                scope.done();
                expect(res.body.name).toEqual('Tsuutina Mark Translation');

                models.Team.findOne({ where: { id: team.id }}).then(results => {
                  expect(results.name).toEqual('Tsuutina Mark Translation');
                  done();
                }).catch(err => {
                  done.fail(err);
                });
              });
          }).catch(err => {
            done.fail(err);
          });
        });

        it('allows an organization member to update an existing record in the database', done => {
          const memberToken = jwt.sign({ ..._access, sub: 'auth0|888888' }, prv, { algorithm: 'RS256', expiresIn: '1h', header: { kid: keystore.all()[0].kid } });

          let memberAgent = new models.Agent({ email: 'member-agent@example.com', accessToken: `Bearer ${memberToken}` });
          memberAgent.save().then(results => {
            memberAgent.addOrganization(organization).then(results => {
              request(app)
                .put('/team')
                .send({
                  id: team.id,
                  name: 'Tsuutina Mark Translation'
                })
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${memberToken}`)
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function(err, res) {
                  if (err) done.fail(err);
                  scope.done();
                  expect(res.body.name).toEqual('Tsuutina Mark Translation');

                  models.Team.findOne({ where: { id: team.id }}).then(results => {
                    expect(results.name).toEqual('Tsuutina Mark Translation');
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

        it('doesn\'t barf if team doesn\'t exist', done => {
          request(app)
            .put('/team')
            .send({
              id: 111,
              name: 'Tsuutina Mark Translation'
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) return done.fail(err);
              scope.done();
              expect(res.body.message).toEqual('No such team');
              done();
            });
        });
      });

      describe('delete', () => {
        it('allows organization creator to remove an existing record from the database', done => {
          organization.getCreator().then(creator => {
            expect(creator.email).toEqual(agent.email);
            expect(team.organizationId).toEqual(organization.id);

            request(app)
              .delete('/team')
              .send({
                id: team.id,
              })
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${signedAccessToken}`)
              .expect('Content-Type', /json/)
              .expect(200)
              .end(function(err, res) {
                if (err) done.fail(err);
                scope.done();
                expect(res.body.message).toEqual('Team deleted');
                models.Team.findAll().then(results => {
                  expect(results.length).toEqual(0);
                  done();
                }).catch(err => {
                  done.fail(err);
                });
              });
          }).catch(err => {
            done.fail(err);
          });
        });

        it('does not allow organization member to remove an existing record from the database', done => {
          const memberToken = jwt.sign({ ..._access, sub: 'auth0|888888' }, prv, { algorithm: 'RS256', expiresIn: '1h', header: { kid: keystore.all()[0].kid } });

          let memberAgent = new models.Agent({ email: 'member-agent@example.com', accessToken: `Bearer ${memberToken}` });
          memberAgent.save().then(results => {
            memberAgent.addOrganization(organization).then(results => {

              request(app)
                .delete('/team')
                .send({
                  id: team.id,
                })
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${memberToken}`)
                .expect('Content-Type', /json/)
                .expect(401)
                .end(function(err, res) {
                  if (err) return done.fail(err);
                  scope.done();
                  expect(res.body.message).toEqual('Unauthorized: Invalid token');
                  models.Team.findAll().then(results => {
                    expect(results.length).toEqual(1);
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

        it('doesn\'t barf if team doesn\'t exist', done => {
          request(app)
            .delete('/team')
            .send({
              id: 111,
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${signedAccessToken}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) return done.fail(err);
              scope.done();
              expect(res.body.message).toEqual('No such team');
              done();
            });
        });
      });
    });

    describe('unauthorized', () => {

      let unauthorizedToken;
      beforeEach(done => {
        unauthorizedToken = jwt.sign({ ..._access, sub: 'auth0|888888' }, prv, { algorithm: 'RS256', expiresIn: '1h', header: { kid: keystore.all()[0].kid } });

        models.Agent.create({ email: 'unauthorizedagent@example.com', accessToken: `Bearer ${unauthorizedToken}` }).then(a => {
          done();
        }).catch(err => {
          done.fail(err);
        });
      });

      describe('create', () => {
        it('returns 401', done => {
          request(app)
            .post('/team')
            .send({
              organizationId: organization.id,
              name: 'Cree Translation Team'
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${unauthorizedToken}`)
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();
              expect(res.body.message).toEqual('Unauthorized: Invalid token');

              done();
            });
        });

        it('does not add a new record to the database', done => {
          models.Team.findAll().then(results => {
            expect(results.length).toEqual(1);

            request(app)
              .post('/team')
              .send({
                organizationId: organization.id,
                name: 'Cree Translation Team'
              })
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${unauthorizedToken}`)
              .expect('Content-Type', /json/)
              .expect(401)
              .end(function(err, res) {
                if (err) done.fail(err);
                scope.done();
                models.Team.findAll().then(results => {
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

      describe('update', () => {
        it('returns 401', done => {
          request(app)
            .put('/team')
            .send({
              id: team.id,
              name: 'Mark Cree Translation'
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${unauthorizedToken}`)
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
            .put('/team')
            .send({
              id: team.id,
              name: 'Mark Cree Translation'
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${unauthorizedToken}`)
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function(err, res) {
              if (err) done.fail(err);
              scope.done();
              models.Team.findOne({ where: { id: team.id }}).then(results => {
                expect(results.name).toEqual(team.name);
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
            .delete('/team')
            .send({
              id: team.id
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${unauthorizedToken}`)
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
          models.Team.findAll().then(results => {
            expect(results.length).toEqual(1);

            request(app)
              .delete('/team')
              .send({
                id: team.id
              })
              .set('Accept', 'application/json')
              .set('Authorization', `Bearer ${unauthorizedToken}`)
              .expect('Content-Type', /json/)
              .expect(401)
              .end(function(err, res) {
                if (err) done.fail(err);
                scope.done();
                models.Team.findAll().then(results => {
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
      const expiredToken = jwt.sign({ ..._access, iat: Math.floor(Date.now() / 1000) - (60 * 60) }, prv, { algorithm: 'RS256', expiresIn: '1h', header: { kid: keystore.all()[0].kid } });
      request(app)
        .get('/team')
        .send({ token: expiredToken })
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
        .get('/team')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {
          if (err) done.fail(err);
          scope.done();
          expect(res.body.message).toEqual('No authorization token was found');
          done();
        });
    });
  });
});
