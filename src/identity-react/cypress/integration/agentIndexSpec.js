// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

context('Agent', function() {

  before(() => {
    cy.fixture('google-auth-response.json').as('profile');
  });
  
  describe('unauthenticated', done => {
    beforeEach(() => {
      cy.visit('/agent');
    });

    it('shows the home page', () => {
      cy.get('h6').contains('Identity');
      cy.get('h4').contains('You are not logged in! Please log in to continue.');
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

  describe('authenticated', done => {
    beforeEach(() => {
      cy.login();
      cy.get('#profile-link').click();
      cy.location('pathname').should('equal', '/agent');
    });

    it('displays agent info', () => {
      cy.get('h4').contains('Profile Page');
    });
  });
});

export {}
