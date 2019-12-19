// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

context('Authentication', function() {

  before(function() {
    cy.fixture('google-profile-response.json').as('profile');
    cy.fixture('someguy-auth0-access-token.json').as('agent');
  });

  describe('/callback', () => {

    let accessToken;
    beforeEach(function() {
      // Need a legitmate accessToken...
      cy.login(this.agent);
      cy.visit('/');
      accessToken = localStorage.getItem('accessToken');

cy.log('accessToken');
cy.log(accessToken);
      // Logout. Blah
      cy.logout();
//
////      cy.visit('/');
//      // CSRF prevention requires state to match
//      localStorage.setItem('state', 'abc123');
      localStorage.setItem('auth0-authorize', 'abc123');

    });

    it('sets the required values in localStorage', () => {
cy.log('TESTING');
//      expect(localStorage.getItem('profile')).to.be.null;
//      expect(localStorage.getItem('isLoggedIn')).to.be.null;
      expect(localStorage.getItem('accessToken')).to.be.null;
//      expect(localStorage.getItem('idToken')).to.be.null;
//      expect(localStorage.getItem('expiresAt')).to.be.null;
//      expect(localStorage.getItem('profile')).to.be.null;

      cy.visit(`/callback#/access_token=${accessToken}&scope=openid%20profile%20email&expires_in=7200&token_type=Bearer&state=${localStorage.getItem('auth0-authorize')}&id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlEwWkROVVJHUWpaRFJrVkVPRFkwUmtNelFqWkNOREF4TWtRNFJqZERRVGszTURReE1EZEJRUSJ9.eyJnaXZlbl9uYW1lIjoiRGFuaWVsIiwiZmFtaWx5X25hbWUiOiJCaWR1bG9jayIsIm5pY2tuYW1lIjoiZGFuaWVsX2JpZHVsb2NrIiwibmFtZSI6IkRhbmllbCBCaWR1bG9jayIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vLUpmb0dNZkh6NkFFL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FDSGkzcmZJTkx0QW55VGdCcWY0N0R1TkRraWJZQUhvaEEvcGhvdG8uanBnIiwibG9jYWxlIjoiZW4iLCJ1cGRhdGVkX2F0IjoiMjAxOS0xMi0xOVQxNToyNTowNi45NDBaIiwiZW1haWwiOiJkYW5pZWxfYmlkdWxvY2tAc2lsLm9yZyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL3NpbGlkLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNzU1MDQzMDIwMDQ0MTI4MzgxMCIsImF1ZCI6InRqcmw4YU9RRXg5QXRRaEZmZnVXbXZQNmJjSE03blhCIiwiaWF0IjoxNTc2NzY5MTA2LCJleHAiOjE1NzY4MDUxMDYsImF0X2hhc2giOiJfTW1QNXRaVVFZYy1jdHJuQ2IzWkJRIiwibm9uY2UiOiJKOGJ0RlQuc0gufjl2QXFWRk1ya2dvdzRzTVpUc0h-MCJ9.QNvvZm18apt6aYV_5bHUgKkz-chFIR8YoQ_uPMBwMW0GDOFgOumef_93mAGQxxko3Cs5gaRjW16m2yC5OoMw5F4MR9iWhTGzNbWx5hJW6zLocFC9Co5C62yIdcXRC-PHXeGZ73DY7nh5zQwQuerXkwI30GBlPhA2D_kbomEVLFhp91nua9yVBue_05XCVTbmWbb8C_ewbDYztxvA-y_7vfpoh3OnAOMXAtNUgJZ7h9DkTsmQrhj9MgPvFEFQnIbcfqGXqHn2btlY_57I9RjwRqfovaSTgsk50JenYVgveQ-aBWBnTUa1IcP-39sPC_PGh6FHCv2cYMzgg0U63qgu-A`).then(() => {

//        expect(localStorage.getItem('profile')).to.not.be.null;
//        expect(localStorage.getItem('isLoggedIn')).to.not.be.null;
        expect(localStorage.getItem('accessToken')).to.not.be.null;
//        expect(localStorage.getItem('idToken')).to.be.not.null;
//        expect(localStorage.getItem('expiresAt')).to.not.be.null;
//        expect(localStorage.getItem('profile')).to.not.be.null;
      });;
    });

    context('successful authentication', () => {

      beforeEach(() => {

        cy.visit(`/callback#/access_token=${accessToken}&scope=openid%20profile%20email&expires_in=7200&token_type=Bearer&state=${localStorage.getItem('state')}&id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlEwWkROVVJHUWpaRFJrVkVPRFkwUmtNelFqWkNOREF4TWtRNFJqZERRVGszTURReE1EZEJRUSJ9.eyJnaXZlbl9uYW1lIjoiRGFuaWVsIiwiZmFtaWx5X25hbWUiOiJCaWR1bG9jayIsIm5pY2tuYW1lIjoiZGFuaWVsX2JpZHVsb2NrIiwibmFtZSI6IkRhbmllbCBCaWR1bG9jayIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vLUpmb0dNZkh6NkFFL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FDSGkzcmZJTkx0QW55VGdCcWY0N0R1TkRraWJZQUhvaEEvcGhvdG8uanBnIiwibG9jYWxlIjoiZW4iLCJ1cGRhdGVkX2F0IjoiMjAxOS0xMi0xOVQxNToyNTowNi45NDBaIiwiZW1haWwiOiJkYW5pZWxfYmlkdWxvY2tAc2lsLm9yZyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL3NpbGlkLmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNzU1MDQzMDIwMDQ0MTI4MzgxMCIsImF1ZCI6InRqcmw4YU9RRXg5QXRRaEZmZnVXbXZQNmJjSE03blhCIiwiaWF0IjoxNTc2NzY5MTA2LCJleHAiOjE1NzY4MDUxMDYsImF0X2hhc2giOiJfTW1QNXRaVVFZYy1jdHJuQ2IzWkJRIiwibm9uY2UiOiJKOGJ0RlQuc0gufjl2QXFWRk1ya2dvdzRzTVpUc0h-MCJ9.QNvvZm18apt6aYV_5bHUgKkz-chFIR8YoQ_uPMBwMW0GDOFgOumef_93mAGQxxko3Cs5gaRjW16m2yC5OoMw5F4MR9iWhTGzNbWx5hJW6zLocFC9Co5C62yIdcXRC-PHXeGZ73DY7nh5zQwQuerXkwI30GBlPhA2D_kbomEVLFhp91nua9yVBue_05XCVTbmWbb8C_ewbDYztxvA-y_7vfpoh3OnAOMXAtNUgJZ7h9DkTsmQrhj9MgPvFEFQnIbcfqGXqHn2btlY_57I9RjwRqfovaSTgsk50JenYVgveQ-aBWBnTUa1IcP-39sPC_PGh6FHCv2cYMzgg0U63qgu-A`);

      });

      it('lands in the right place', () => {
        cy.url().should('match', '/#/');
      });
  
      it('renders the interface', () => {
        cy.get('#logout-button').contains('Logout');
      });
    });
  });
  
  describe('not logged in', () => {
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

  describe('logged in', () => {
    beforeEach(function() {
      cy.login(this.agent);
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
      cy.get('#app-menu ul div:nth-of-type(3) a').should('have.attr', 'href', '#organization').and('contain', 'Organizations');
      cy.get('#app-menu ul:nth-of-type(2) div').contains('Help');
    });
  });
});

export {}
