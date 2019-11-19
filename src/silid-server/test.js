const NodeRSA = require('node-rsa');
const pem2jwk = require('pem-jwk').pem2jwk

// https://github.com/auth0/node-jsonwebtoken/issues/68
const key = new NodeRSA({b: 512, e: 5});

key.setOptions({
  encryptionScheme: {
    scheme: 'pkcs1',
    label: 'Optimization-Service'
  },
  signingScheme: {
      saltLength: 25
  }
});

const prv = key.exportKey('pkcs1-private-pem');
const pub = key.exportKey('pkcs8-public-pem');


var jose = require('node-jose');

const keystore = jose.JWK.createKeyStore();


//keystore.add(pem2jwk(pub), 'pkcs8').then(function(result) {
const p2j = pem2jwk(pub);
p2j.use = 'sig';
console.log('p2j');
console.log(p2j);
keystore.add(p2j, 'pkcs8').then(function(result) {
          // {result} is a jose.JWK.Key
  //console.log(result);
});



//////
const key2 = new NodeRSA({b: 512, e: 5});

key2.setOptions({
  encryptionScheme: {
    scheme: 'pkcs1',
    label: 'Optimization-Service'
  },
  signingScheme: {
      saltLength: 25
  }
});

const prv2 = key2.exportKey('pkcs1-private-pem');
const pub2 = key2.exportKey('pkcs8-public-pem');
//////


const jwt = require('jsonwebtoken');

const token = jwt.sign({name: 'Dan', message: 'Hello, world!'}, prv2, { algorithm: 'RS256' });

jwt.verify(token, pub2, {algorithms: ['RS256'], ignoreExpiration: true}, function(err, result) {
  console.log('HELLO');
  console.log('error', err);
  console.log('verified', result);
});




//keystore.generate("oct", 256).
//        then(function(result) {
//          // {result} is a jose.JWK.Key
//          key = result;
//        });
//
//jose.JWK.createKey("oct", 256, { alg: "A256GCM" }).
//         then(function(result) {
//          console.log(result.toJSON(true));
//           // {result} is a jose.JWK.Key
//           // {result.keystore} is a unique jose.JWK.KeyStore
//         });



////
////const JSONWebKey = require('json-web-key');
////const jwkToPem = require('jwk-to-pem');
////const jwt = require('jsonwebtoken');
////const NodeRSA = require('node-rsa');
////
////
////const pem = new NodeRSA({ hash: 'sha256' });
////console.log('pem');
////console.log(pem.exportKey());
////
//////let jsonwebkey = JSONWebKey.fromPEM(pem.exportKey()).toJSON();
//////console.log('jsonwebkey');
//////console.log(jsonwebkey);
////////console.log(JSONWebKey.PEM);
////
////
////const token = { 'kty': 'RSA', 'kid': 'myjwt', 'e': 'eee', 'n': 'nnn', 'd': 'ddd', 'p': 'ppp', 'q': 'qqq', 'dp': 'dp', 'dq': 'dq', 'qi': 'qi' }
////
////let jsonwebkey = JSONWebKey.fromJSON(token).toJSON();
////console.log('jsonwebkey');
////console.log(jsonwebkey);
////console.log(jwkToPem(jsonwebkey));
////
////console.log('signing');
////const resultJwt = jwt.sign(jsonwebkey, jwkToPem(jsonwebkey, {private: true}), { expiresIn: '1h', algorithm: 'RS256' })
////console.log(resultJwt);
////
//
//var jwkToPem = require('jwk-to-pem');
//var jwt = require('jsonwebtoken');
//
//var jwk = { 'kty': 'RSA', 'kid': 'myjwt', 'e': 'eee', 'n': 'nnn', 'd': 'ddd', 'p': 'ppp', 'q': 'qqq', 'dp': 'dp', 'dq': 'dq', 'qi': 'qi' };
//var pem = jwkToPem(jwk, { private: true });
//
//console.log(pem);
//
//const _access = require('./spec/fixtures/sample-auth0-access-token');
////const resultJwt = jwt.sign(_access, pem, { expiresIn: '1h', algorithm: 'RS256' })
//const resultJwt = jwt.sign(_access, pem, { expiresIn: '1h', algorithm: 'RS256' })
//
//console.log(resultJwt);
//
////jwt.verify(token, pem);
