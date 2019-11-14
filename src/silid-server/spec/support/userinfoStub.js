const jwt = require('jsonwebtoken');

/**
 * Auth0 /userinfo mock
 */
module.exports = function(access, identity) {
  const nock = require('nock')
  const header = `Bearer ${jwt.sign(access, process.env.CLIENT_SECRET, { expiresIn: '1h' })}`;
  const scope = nock(`https://${process.env.AUTH0_DOMAIN}`, {
      reqheaders: {
        'Authorization': header
      }
    })
    .persist()
    .get('/userinfo')
    .reply(200, identity);

  return { header, scope };
};
