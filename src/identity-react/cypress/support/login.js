const passport = require('@passport-next/passport');
//const Strategy = require('passport-mocked').Strategy;
const Strategy = require('@passport-next/passport-mocked').Strategy;
const httpMocks = require('node-mocks-http');


passport.use(new Strategy({
    name: 'auth0',
    domain: 'process.env.AUTH0_DOMAIN',
    clientID: 'process.env.AUTH0_CLIENT_ID',
    clientSecret: 'process.env.AUTH0_CLIENT_SECRET',
    callbackURL:  '/callback',
    passReqToCallback: true,
  },
  function (accessToken, refreshToken, profile, done) {
    console.log('THE STRATEGY HAS BEEN CALLED');
    console.log(accessToken);
    console.log(res);
    console.log(profile);
    return done(null, profile);
  })
);

// You can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
  console.log('serialize user');
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  console.log('deserialize user');
  done(null, user);
});

let p = passport.session();
console.log(p);

//let p = passport.initialize();
//console.log(p);

let strategy = passport._strategies['auth0'];
  
strategy._token_response = {
  access_token: 'at-1234',
  expires_in: 3600
};
  
// Google response as of 2019-10-22
const profile = {
  'displayName': 'Some Guy',
  'id': 'google-oauth2|100000000000000000010',
  'user_id': 'google-oauth2|100000000000000000000',
  'name': {
    'familyName': 'Guy',
    'givenName': 'Some'
  },
  'emails': [
    {
      'value': 'someguy@example.com'
    }
  ],
  'picture': '/images/photo.jpg',
  'locale': 'en',
  'nickname': 'someguy'
};
strategy._profile = profile;


const { req, res } = httpMocks.createMocks({
    method: 'GET',
    //url: '/authorize?scope=openid%20profile%20email&response_type=code&response_mode=query&state=fmt2dDQ0NHZGY21BS35RZW5SQ3dZS0VWaDFrSzlPZlEwSG5CUkJxa2JRUg%3D%3D&nonce=kHEfjqHYKaOz_E~3j3fxiC61sqWdXImVRFXFekZRjri&code_challenge=t0B25z4NzEdDHS5zBcuxDhMbc4jJTWXmRxJzzTt-IKE&code_challenge_method=S256&auth0Client=eyJuYW1lIjoiYXV0aDAtc3BhLWpzIiwidmVyc2lvbiI6IjEuMy4wIn0%3D',
    url: '/authorize',
    query: {
      scope: 'openid profile email',
      response_type: 'code',
      response_mode: 'query',
      state: 'somelongstatestring',
      nonce: 'somelongnoncestring',
      code_challenge: 'somecodechallengestring',
      __mock_strategy_callback: true,
    },
    logIn: (user, options, done) => {
      console.log('user', user);
      console.log('options',options);
      return done;
    },
    __passport: [passport.initialize(),passport.session()]
  },
  {
    eventEmitter: require('events').EventEmitter,
  });

res.on('end', function(test, result) {
  console.log("word up", res)
});

passport.authenticate('auth0', { scope: 'openid email profile' })(req, res);

//  console.log(authenticate.toString());

//const req = httpMocks.createRequest();
//const res = httpMocks.createResponse();

//  console.log(req);
//  console.log(res);

//const next =
//authenticate(req, res, function(req, res) {
//  console.log('HERE');
//  console.log(req);
//
//});

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

//Cypress.Commands.add('login', (overrides = {}) => {
//  Cypress.log({
//    name: 'loginViaAuth0',
//  });
//
//  const options = {
//    method: 'POST',
//    url: 'https://dev-sillsdev.auth0.com/oauth/token',
//    body: {
//      grant_type: 'password',
//      username: 'auth_username',
//      password: 'auth_password',
//      audience: 'auth_audience',
//      scope: 'openid profile email',
//      client_id: 'auth_client_id',
//      client_secret: 'auth_client_secret',
//    },
//  };
//  cy.request(options);
//});

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
