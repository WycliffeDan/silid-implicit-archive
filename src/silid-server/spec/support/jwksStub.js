const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');

/**
 * Auth0 `/.well-known/jwks.json` mock
 */
module.exports = function(access, jwks, pem) {
  const nock = require('nock')
//  const header = `Bearer ${jwt.sign(access, process.env.CLIENT_SECRET, { expiresIn: '1h' })}`;
//  const header = `Bearer ${jwt.sign(access, jwkToPem(jwks.keys[0], {private: true}), { expiresIn: '1h', algorithm: 'RS256' })}`;
  const header = `Bearer ${jwt.sign(access, pem, { expiresIn: '1h', algorithm: 'RS256' })}`;
  const jwksScope = nock(`https://${process.env.AUTH0_DOMAIN}`, {
      reqheaders: {
        'Authorization': header
      }
    })
    .persist()
    .get('/.well-known/jwks.json')
    .reply(200, JSON.stringify(jwks));

  return {jwksScope };
};
