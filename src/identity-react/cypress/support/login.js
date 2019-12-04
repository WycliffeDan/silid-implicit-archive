/**
 * Auth0 is a real pain to stub. This fakes login by setting some
 * items in localStorage
 */
Cypress.Commands.add('login', function(token) {
  Cypress.log({
    name: 'loginViaAuth0',
  });

  cy.fixture('google-profile-response.json').as('profile');

  cy.request({ url: 'http://localhost:3002/sign', method: 'POST', body: { accessToken: token } }).then(function(res) {

    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('isLoggedIn', 'true');
        win.localStorage.setItem('accessToken', res.body);
        win.localStorage.setItem('idToken', 'id-token-here');
        win.localStorage.setItem('expiresAt', Math.floor(new Date()) + 3600);
        // This is a total cheat. This data is being loaded in fixtures rather
        // than going to the extreme length of mocking the `idTokenPayload` 
        win.localStorage.setItem('profile', JSON.stringify(this.profile));
      },
    });
  });
});
