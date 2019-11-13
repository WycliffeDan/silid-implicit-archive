// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

context('Authentication', function() {

  before(() => {
    cy.fixture('google-profile-response.json').as('profile');
  });
  
  describe('not logged in', done => {
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
  });

  describe('logged in', done => {
    beforeEach(() => {
      cy.login();
    });

    it('does not display the login link', () => {
      cy.get('#login-button').should('not.exist');
    });

    it('displays a friendly greeting', () => {
      cy.contains('You are logged in!');
    });

    it('renders the navbar correctly', () => {
      cy.get('#logout-button').contains('Logout');
      cy.get('header a').contains('Profile').and('have.attr', 'href', '/agent');
    });
  });
});

export {}
