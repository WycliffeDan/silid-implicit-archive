
//Cypress.Commands.add('login', (overrides = {}) => {
//  Cypress.log({
//    name: 'loginViaAuth0',
//  });
//
//  cy.server();
//
//  /**
//   * 2019-11-6 Pay no mind the verbosity. This helps me understand what's happening at Auth0
//   */
//  const body = {
//    access_token: 'sometoken',
//    expires_in: 3600,
//    id_token: 'someid'
//  };
//  const {access_token, expires_in, id_token} = body;
//  const auth0State = {
//    nonce: '',
//    state: 'some-random-state'
//  };
//  const callbackUrl = `/callback#access_token=${access_token}&scope=openid&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`;
//
//  cy.route({
//    method: 'GET',
//    url: `**/authorize?*`,
//    response: []
////    response: {
////      redirect: callbackUrl 
////    }   
//  });
//});

Cypress.Commands.add('login', (overrides = {}) => {
  Cypress.log({
    name: 'loginViaAuth0',
  });

  const options = {
    method: 'POST',
    url: 'https://dev-sillsdev.auth0.com/oauth/token',
    body: {
      grant_type: 'password',
      username: 'auth_username',
      password: 'auth_password',
      audience: 'auth_audience',
      scope: 'openid profile email',
      client_id: 'auth_client_id',
      client_secret: 'auth_client_secret',
    },
  };
  cy.request(options);
});

//Cypress.Commands.add('login', (overrides = {}) => {
//  Cypress.log({
//    name: 'loginViaAuth0',
//  });
//
//  const options = {
//    method: 'POST',
//    url: Cypress.env('auth_url'),
//    body: {
//      grant_type: 'password',
//      username: Cypress.env('auth_username'),
//      password: Cypress.env('auth_password'),
//      audience: Cypress.env('auth_audience'),
//      scope: 'openid profile email',
//      client_id: Cypress.env('auth_client_id'),
//      client_secret: Cypress.env('auth_client_secret'),
//    },
//  };
//  cy.request(options);
//});
