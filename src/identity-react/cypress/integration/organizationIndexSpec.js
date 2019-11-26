// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

const models = require('../../../silid-server/models');
const fixtures = require('sequelize-fixtures');

context('Organization', function() {

  before(function() {
    cy.fixture('google-profile-response.json').as('profile');
  });
  
  describe('unauthenticated', done => {
    beforeEach(() => {
      cy.visit('/#/organization');
    });

    it('shows the home page', () => {
      cy.get('h6').contains('Identity');
    });

    it('displays the login button', () => {
      cy.get('#login-button').contains('Login');
    });

    it('does not display the logout button', () => {
      cy.get('#logout-button').should('not.exist');
    });

    it('redirects home', () => {
      cy.location('pathname').should('equal', '/');
    });
  });

  describe('authenticated', () => {
    let organization, agent;
//    beforeEach(done => {
//      models.sequelize.sync({force: true}).then(() => {
//        fixtures.loadFile(`${__dirname}/../../../silid-server/spec/fixtures/agents.json`, models).then(() => {
//          models.Agent.findAll().then(results => {
//            agent = results[0];
//            fixtures.loadFile(`${__dirname}/../../../silid-server/spec/fixtures/organizations.json`, models).then(() => {
//              models.Organization.findAll().then(results => {
//                organization = results[0];
//  
//                // This agent has recently returned for a visit
//                agent.accessToken = `Bearer ${signedAccessToken}`;
//                agent.save().then(() => {
//
//                  cy.login();
//                  cy.get('#app-menu-button').click();
//                  cy.contains('Organizations').click();
//
//                  done();
//                }).catch(err => {
//                  done.fail(err);
//                });
//              });
//            }).catch(err => {
//              done.fail(err);
//            });
//          }).catch(err => {
//            done.fail(err);
//          });
//        }).catch(err => {
//          done.fail(err);
//        });
//      }).catch(err => {
//        done.fail(err);
//      });
//    });


    beforeEach(() => {
      cy.login();
      cy.get('#app-menu-button').click();
      cy.contains('Organizations').click();
    });

    it('lands in the right spot', () => {
      cy.url().should('contain', '/#/organization');
    });

    it('displays common Organization interface elements', function() {
      cy.get('h3').contains('Organizations');
      cy.get('button#add-organization').should('exist');
    });

    describe('organization membership', () => {
      context('no organizations', () => {
        it('displays no organizations', () => {
        });
      });

      context('some organizations', () => {
        it('displays a list of organizations', () => {
        });
      });
    });

    describe('organization creator', () => {
      context('no organizations created by this agent', () => {
        it('displays no organizations', () => {
        });
      });

      context('agent has created organizations', () => {
        it('displays a list of organizations', () => {
        });
      });
    });
  });
});

export {}
