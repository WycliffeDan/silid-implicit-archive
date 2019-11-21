export const AUTH_CONFIG = {
  domain: 'silid.auth0.com',
  clientId: 'tjrl8aOQEx9AtQhFffuWmvP6bcHM7nXB',
  //callbackUrl:'https://profile-dev.languagetechnology.org/callback',
  callbackUrl: process.env.REACT_APP_CALLBACK_URL,
  audience: 'https://id.languagetechnology.org/',
  offline: 'true'
};
