// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

context('Authentication', function() {

  before(() => {
    cy.fixture('google-auth-response.json').as('profile');
  });
  
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  context('first visit', () => {
    it('shows the home page', () => {
      cy.get('h6').contains('Identity');
    });
  
    it('displays the login button', () => {
      cy.get('#login-button').contains('Login');
    });
  
    it('does not display the logout button', () => {
      cy.get('#logout-button').should('not.exist');
    });
  });

  describe('login process', done => {
    beforeEach(() => {

      cy.server();
      cy.route({
        method: 'GET',
        //url: `*dev-sillsdev.auth0.com*`,
        url: `https://dev-sillsdev.auth0.com/oauth/token`,
        response: []
      });
      cy.login();

  cy.log('window fetch being deleted');

//      cy.contains('Login').click();

//      cy.on('window:before:load', (win) => {
//        delete win.fetch;
//            cy.log('Hello');
//        done();
////        cy.contains('Login').click()
////          .then((resp) => {
////            return resp.body;
////          })
////          .then((body) => {
////            const {access_token, expires_in, id_token} = body;
////            const auth0State = {
////              nonce: '',
////              state: 'some-random-state'
////            };
////            const callbackUrl = `/callback#access_token=${access_token}&scope=openid&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`;
////            cy.visit(callbackUrl, {
////              onBeforeLoad(win) {
////                win.document.cookie = 'com.auth0.auth.some-random-state=' + JSON.stringify(auth0State);
////              }
////            });
////          })
//      });
    });

    it('does not display the login link', () => {
//      cy.contains('Login').click();
      cy.get('#login-button').should('not.exist');
    });

//    it('displays a friendly greeting', () => {
//      cy.contains(`Welcome ${this.profile.nickname}`);
//    });
//
//    it('renders the navbar correctly', () => {
//      cy.get('nav a').contains('Home').and('have.attr', 'href', '/');
//      cy.get('nav a').contains('Profile').and('have.attr', 'href', '/user');
//      cy.get('nav a').contains('Logout').and('have.attr', 'href', '/logout');
//    });
//
//    it('redirects to the Profile page', () => {
//    });
//
//    describe('logout', function() {
//      it('does not display the logout button if not logged in', () => {
//      });
//    });
  });

//  describe('unauthenticated', () => {
//    it('shows login link', function () {
//      cy.visit('http://localhost:3000')
//      cy.get('#login-button').should('be.visible')
//        .and('have.text', 'Log in')
//    })
//  })

  // more examples
  //
  // https://github.com/cypress-io/cypress-example-todomvc
  // https://github.com/cypress-io/cypress-example-kitchensink
  // https://on.cypress.io/writing-your-first-test
});

export {}
