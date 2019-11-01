const PORT = process.env.NODE_ENV === 'production' ? 3000 : 3001;
const app = require('../../app');
const fixtures = require('sequelize-fixtures');
const models = require('../../models');
const jwt = require('jsonwebtoken');
const request = require('supertest');

describe('projectSpec', () => {

  let project, organization, agent;
  beforeEach(done => {
    models.sequelize.sync({force: true}).then(() => {
      fixtures.loadFile(`${__dirname}/../fixtures/agents.json`, models).then(() => {
        models.Agent.findAll().then(results => {
          agent = results[0];
          fixtures.loadFile(`${__dirname}/../fixtures/organizations.json`, models).then(() => {
            models.Organization.findAll().then(results => {
              organization = results[0];
              fixtures.loadFile(`${__dirname}/../fixtures/projects.json`, models).then(() => {
                models.Project.findAll().then(results => {
                  project = results[0];
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
  });

  describe('authenticated', () => {

    let token;
    beforeEach(done => {
      token = jwt.sign({ email: agent.email, iat: Math.floor(Date.now()) }, process.env.SECRET, { expiresIn: '1h' });
      done();
    });

    describe('authorized', () => {

      describe('create', () => {
        it('adds a new record to the database', done => {
          models.Project.findAll().then(results => {
            expect(results.length).toEqual(1);

            request(app)
              .post('/project')
              .send({
                token: token,
                organizationId: organization.id, 
                name: 'Tsuutina Translation' 
              })
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .expect(201)
              .end(function(err, res) {
                if (err) done.fail(err);
                expect(res.body.name).toEqual('Tsuutina Translation');

                models.Project.findAll().then(results => {
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
            .post('/project')
            .send({
              token: token,
              organizationId: organization.id, 
              name: project.name 
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              expect(res.body.errors.length).toEqual(1);
              expect(res.body.errors[0].message).toEqual('That project is already registered');
              done();
            });
        });
      });
  
      describe('read', () => {
        it('retrieves an existing record from the database', done => {
          request(app)
            .get(`/project/${project.id}`)
            .send({ token: token })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              expect(res.body.email).toEqual(project.email);
              done();
            });
        });

        it('doesn\'t barf if record doesn\'t exist', done => {
          request(app)
            .get('/project/33')
            .send({ token: token })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              expect(res.body.message).toEqual('No such project');
              done();
            });
        });
      });
 
      describe('update', () => {
        it('updates an existing record in the database', done => {
          request(app)
            .put('/project')
            .send({
              token: token,
              id: project.id,
              name: 'Tsuutina Mark Translation'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function(err, res) {
              if (err) done.fail(err);
              expect(res.body.name).toEqual('Tsuutina Mark Translation');
 
              models.Project.findOne({ where: { id: project.id }}).then(results => {
                expect(results.name).toEqual('Tsuutina Mark Translation');
                expect(results.email).toEqual(project.email);
                done();
              }).catch(err => {
                done.fail(err);
              });
            });
        });

        it('doesn\'t barf if project doesn\'t exist', done => {
          request(app)
            .put('/project')
            .send({
              token: token,
              id: 111,
              name: 'Tsuutina Mark Translation'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) done.fail(err);
              expect(res.body.message).toEqual('No such project');
              done();
            });
        });
      });

//      describe('delete', () => {
//        it('removes an existing record from the database', done => {
//          request(app)
//            .delete('/project')
//            .send({
//              token: token,
//              id: project.id,
//            })
//            .set('Accept', 'application/json')
//            .expect('Content-Type', /json/)
//            .expect(200)
//            .end(function(err, res) {
//              if (err) done.fail(err);
//              expect(res.body.message).toEqual('Project deleted');
//              done();
//            });
//        });
//
//        it('doesn\'t barf if project doesn\'t exist', done => {
//          request(app)
//            .delete('/project')
//            .send({
//              token: token,
//              id: 111,
//            })
//            .set('Accept', 'application/json')
//            .expect('Content-Type', /json/)
//            .expect(200)
//            .end(function(err, res) {
//              if (err) done.fail(err);
//              expect(res.body.message).toEqual('No such project');
//              done();
//            });
//        });
//      });
    });

    describe('unknown', () => {
//      let newToken;
//      beforeEach(done => {
//        newToken = jwt.sign({ email: 'brandnewproject@example.com', iat: Math.floor(Date.now()) }, process.env.SECRET, { expiresIn: '1h' });
//        done();
//      });
//
//      describe('create', () => {
//        it('returns 500', done => {
//          request(app)
//            .post('/project')
//            .send({
//              token: newToken,
//              name: 'One Book Canada' 
//            })
//            .set('Accept', 'application/json')
//            .expect('Content-Type', /json/)
//            .expect(500)
//            .end(function(err, res) {
//              if (err) done.fail(err);
//              expect(res.body.errors.length).toEqual(1);
//              expect(res.body.errors[0].message).toEqual('Project.creatorId cannot be null');
//
//              done();
//            });
//        });
//
//        it('does not add a new record to the database', done => {
//          models.Project.findAll().then(results => {
//            expect(results.length).toEqual(1);
//
//            request(app)
//              .post('/project')
//              .send({
//                token: newToken,
//                name: 'One Book Canada' 
//              })
//              .set('Accept', 'application/json')
//              .expect('Content-Type', /json/)
//              .expect(500)
//              .end(function(err, res) {
//                if (err) done.fail(err);
//                models.Project.findAll().then(results => {
//                  expect(results.length).toEqual(1);
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

    describe('unauthorized', () => {
//
//      let wrongToken;
//      beforeEach(done => {
//        wrongToken = jwt.sign({ email: 'unauthorizedproject@example.com', iat: Math.floor(Date.now()) }, process.env.SECRET, { expiresIn: '1h' });
//        done();
//      });
//
//      describe('update', () => {
//        it('returns 401', done => {
//          request(app)
//            .put('/project')
//            .send({
//              token: wrongToken,
//              id: project.id,
//              name: 'Some Cool Guy'
//            })
//            .set('Accept', 'application/json')
//            .expect('Content-Type', /json/)
//            .expect(401)
//            .end(function(err, res) {
//              if (err) done.fail(err);
//              expect(res.body.message).toEqual('Unauthorized: Invalid token');
//              done();
//            });
//        });
//
//        it('does not change the record in the database', done => {
//          request(app)
//            .put('/project')
//            .send({
//              token: wrongToken,
//              id: project.id,
//              name: 'Some Cool Guy'
//            })
//            .set('Accept', 'application/json')
//            .expect('Content-Type', /json/)
//            .expect(401)
//            .end(function(err, res) {
//              if (err) done.fail(err);
//              models.Project.findOne({ where: { id: project.id }}).then(results => {
//                expect(results.name).toEqual(project.name);
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
//            .delete('/project')
//            .send({
//              token: wrongToken,
//              id: project.id
//            })
//            .set('Accept', 'application/json')
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
//          models.Project.findAll().then(results => {
//            expect(results.length).toEqual(1);
//
//            request(app)
//              .delete('/project')
//              .send({
//                token: wrongToken,
//                id: project.id
//              })
//              .set('Accept', 'application/json')
//              .expect('Content-Type', /json/)
//              .expect(401)
//              .end(function(err, res) {
//                if (err) done.fail(err);
//                models.Project.findAll().then(results => {
//                  expect(results.length).toEqual(1);
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
    it('returns 401 if provided an expired token', done => {
      const expiredToken = jwt.sign({ email: agent.email, iat: Math.floor(Date.now() / 1000) - (60 * 60) }, process.env.SECRET, { expiresIn: '1h' });
      request(app)
        .get('/project')
        .send({ token: expiredToken })
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
        .get('/project')
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
