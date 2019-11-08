
/**
 * Auth0 is a real pain to stub. This fakes login by setting some
 * items in localStorage
 */
Cypress.Commands.add('login', (overrides = {}) => {
  Cypress.log({
    name: 'loginViaAuth0',
  });

  cy.visit('/', {
    onBeforeLoad: (win) => {
      win.localStorage.setItem('isLoggedIn', 'true');
      win.localStorage.setItem('accessToken', 'access-token-here');
      win.localStorage.setItem('idToken', 'id-token-here');
      win.localStorage.setItem('expiresAt', Math.floor(new Date()) + 3600);
    },
  });
});
