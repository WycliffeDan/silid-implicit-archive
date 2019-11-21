// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

context('Authentication', function() {

  before(function() {
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

    it('renders the navbar correctly', function() {
      cy.get('#logout-button').contains('Logout');
      cy.get('img[alt=avatar]').should('have.attr', 'src', this.profile.picture);
    });

    it('renders the app-menu correctly', () => {
      cy.get('#app-menu').should('not.exist');
      cy.get('#app-menu-button').click();

      cy.get('#app-menu ul div:nth-of-type(1) a').should('have.attr', 'href', '#/').and('contain', 'Home');
      cy.get('#app-menu ul div:nth-of-type(2) a').should('have.attr', 'href', '#agent').and('contain', 'Personal Info');
      cy.get('#app-menu ul:nth-of-type(2) div').contains('Help');
    });
  });
});

export {}
