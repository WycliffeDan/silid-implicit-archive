
Cypress.Commands.add('login', (overrides = {}) => {
  Cypress.log({
    name: 'loginViaAuth0',
  });

  cy.server();

  /**
   * 2019-11-6 Pay no mind the verbosity. This helps me understand what's happening at Auth0
   */
  const body = {
    access_token: 'sometoken',
    expires_in: 3600,
    id_token: 'someid'
  };
  const {access_token, expires_in, id_token} = body;
  const auth0State = {
    nonce: '',
    state: 'some-random-state'
  };
  const callbackUrl = `/callback#access_token=${access_token}&scope=openid&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`;

  cy.route({
    method: 'GET',
    url: `https://${process.env.REACT_APP_DOMAIN}/authorize?*`,
    response: {
      redirect: callbackUrl 
    }   
  });
});
