// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

context('Authentication', () => {
  let profile = cy.fixture('google-auth-response.json');
  
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  context('first visit', () => {
    it('shows the home page', () => {
      cy.get('nav div').contains('identity');
    });
  
    it('displays the login button', () => {
      cy.get('nav a').contains('Log in').and('have.attr', 'href', '/login');
    });
  
    it('does not display the logout button', () => {
      cy.get('nav a').should('not.have.attr', 'href', '/logout');
    });
  });

  describe('login process', () => {
    beforeEach(() => {
      cy.contains('Log In').click();
    });

    it('does not display the login link', () => {
      cy.get('nav a').should('not.have.attr', 'href', '/login');
    });

    it('displays a friendly greeting', () => {
      cy.contains(`Welcome ${profile.nickname}`);
    });

    it('renders the navbar correctly', () => {
      cy.get('nav a').contains('Home').and('have.attr', 'href', '/');
      cy.get('nav a').contains('Profile').and('have.attr', 'href', '/user');
      cy.get('nav a').contains('Logout').and('have.attr', 'href', '/logout');
    });

    it('redirects to the Profile page', () => {
    });

    describe('logout', function() {
      it('does not display the logout button if not logged in', () => {
      });
    });
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
