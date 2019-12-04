/**
 * Auth0 is a real pain to stub. This fakes login by setting some
 * items in localStorage
 */
Cypress.Commands.add('login', function(token) {
  Cypress.log({
    name: 'loginViaAuth0',
  });

  cy.request({ url: 'http://localhost:3002/sign', method: 'POST', body: { accessToken: token } }).then(function(res) {

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
