/**
 * Auth0 is a real pain to stub. This fakes login by setting some
 * items in localStorage
 */
Cypress.Commands.add('login', function(overrides = {}) {
  Cypress.log({
    name: 'loginViaAuth0',
  });

//  cy.fixture('google-profile-response.json').then(profile => {;

  cy.task('log', "FETCHING");

  cy.request('http://localhost:3002/access').then(function(res) {

    cy.task('log', "FETCHed");
    cy.task('log', res.body)

    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('isLoggedIn', 'true');
        win.localStorage.setItem('accessToken', res.body);
        win.localStorage.setItem('idToken', 'id-token-here');
        win.localStorage.setItem('expiresAt', Math.floor(new Date()) + 3600);
//        win.localStorage.setItem('profile', JSON.stringify(profile));
      },
    });
  });
});
