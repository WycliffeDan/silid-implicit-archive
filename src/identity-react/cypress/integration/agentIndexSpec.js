// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

context('Agent', function() {

  before(function() {
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

  describe('authenticated', () => {

    context('first visit', () => {
      beforeEach(() => {
        cy.login();
        cy.get('#profile-link').click();
        cy.location('pathname').should('equal', '/agent');
      });

      it('displays agent social profile info in form', function() {
        cy.get('h4').contains('Profile Page');
        cy.get('input[name="name"][type="text"]').should('have.value', this.profile.displayName);
        cy.get('input[name="email"][type="email"]').should('have.value', this.profile.emails[0].value);
        cy.get('button[type="submit"]').should('exist');
      });

      it('disables the Save button', () => {
        cy.get('button[type="submit"]').should('be.disabled');
      });

      it('enables Save button when Name field changes', () => {
        cy.get('button[type="submit"]').should('be.disabled');
        cy.get('input[name="name"][type="text"]').type('Some Guy');
        cy.get('button[type="submit"]').should('not.be.disabled');
      });

      it('enables Save button when Email field changes', () => {
        cy.get('button[type="submit"]').should('be.disabled');
        cy.get('input[name="email"][type="email"]').type('someguy@example.com');
        cy.get('button[type="submit"]').should('not.be.disabled');
      });
    });
  });
});

export {}
