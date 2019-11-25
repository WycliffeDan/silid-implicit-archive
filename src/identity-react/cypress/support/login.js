//const fetch = require('fetch').fetchUrl;
/**
 * Auth0 is a real pain to stub. This fakes login by setting some
 * items in localStorage
 */
Cypress.Commands.add('login', function(overrides = {}) {
  Cypress.log({
    name: 'loginViaAuth0',
  });

//  cy.fixture('google-profile-response.json').then(profile => {;

//  fetch(`http://localhost:3002/access`).then(result => {
console.log("FETCHING");
  fetch(`http://localhost:3002/access`, { mode: 'no-cors' }).then((result) => {
console.log("FETCHed");
console.log(result);
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('isLoggedIn', 'true');
        //win.localStorage.setItem('accessToken', 'access-token-here');
        win.localStorage.setItem('accessToken', `Bearer ${result.body}`);
        win.localStorage.setItem('idToken', 'id-token-here');
        win.localStorage.setItem('expiresAt', Math.floor(new Date()) + 3600);
        win.localStorage.setItem('profile', JSON.stringify(profile));
      },
    });
  });
//  }).catch(err => [
//    console.log(err);
//  });
//  });
});
