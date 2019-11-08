// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

context('Authentication', function() {

  before(() => {
    cy.fixture('google-auth-response.json').as('profile');
  });
  
  beforeEach(() => {
    cy.visit('/');
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
        url: 'http://localhost:3000/authorize?*',
        //url: `https://dev-sillsdev.auth0.com/oauth/token`,
        response: 'Word up!' 
      });
//      cy.login();

//      cy.contains('Login').click();

    let callbackStr = '/callback#access_token=CWTnwtvkU4B2j6f4lgtcSSKtS-iY9tVN&scope=openid&id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJVSXlRa1k1TmtaQlJUWkZNVUV3UmpkRlJUUTVSVEV4UWpjelFUSXhRVE14TWpWRVJrWkRRUSJ9.eyJuaWNrbmFtZSI6ImUyZS10ZXN0aW5nIiwibmFtZSI6ImUyZS10ZXN0aW5nQGV4YW1wbGUuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyL2M1MTU5OGQ0ZjljYzFiN2YwMmY4YjE5NDZhZjNhOGQwP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGZTIucG5nIiwidXBkYXRlZF9hdCI6IjIwMTktMTEtMDhUMjA6MzU6MTIuMjc0WiIsImVtYWlsIjoiZTJlLXRlc3RpbmdAZXhhbXBsZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOi8vZGV2LXNpbGxzZGV2LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1ZGE3NjEwMDFkZmVkMDBkNzEwOTNkMDAiLCJhdWQiOiJvdmdYdmdrczVNQ1NYMktMZ1o3dHFnNkhhTTd5NGFXZiIsImlhdCI6MTU3MzI0NTMxMiwiZXhwIjoxNTczMjgxMzEyfQ.k7SXijY-6ulv1cYZ1pMfRdW7nVmjLvzVLmD8FnX8T5q7paPSpPwF38JKzgVGS61nYo2aTjVaHb7ptNMZkjJx8xDudvV-hslZvMwpUGQz3kyXWQ0YYvlFk24zaR7AKcyTEa9T7IQCad90uo9EiQxyJggvSp8cpWCW_C8dufWdk9A4vUXsHB5XpGSvO7ne0Jn7ZCRT1reG059_t6vb2JbtmNHFqHzGB8RRPJcUBm0btuDwQeWxBELbOOD0ypPwtFqShnJnptkZBnfUb-JHOcL2BP_g6X2ds5cDqzFPFaJF20Oy9JmBsp1_VBoIys0DIhDMXkz_LTyNTCc0ABKStsXyIA&expires_in=86400&token_type=Bearer&state=some-random-state'

      //cy.visit('/callback#access_token=access_token&scope=openid&id_token=id_token&expires_in=expires_in&token_type=Bearer&state=goodinthehood');
      cy.visit(callbackStr);

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
