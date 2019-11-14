require('dotenv').config();
const jwt = require('jsonwebtoken');
const models = require('../models');
const request = require('request');

const jwtAuth = function(req, res, next) {

  models.Agent.findOne({ where: { accessToken: req.header('Authorization') } }).then(agent => {
    req.agent = agent;

    if (!req.agent) {
      request.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
          headers: {
            'Authorization': req.header('Authorization')
          }
        },
        function(error, response, body) {
          if (error) {
            return next(error);
          } 
          body = JSON.parse(body);
          models.Agent.update(
            { accessToken: req.header('Authorization'), socialProfile: body },
            { returning: true, where: { email: body.email } }).then(function([rowsUpdate, [updatedAgent]]) {

            if (updatedAgent) {
              req.agent = updatedAgent;
              next();
            }
            else {
              models.Agent.create({ name: body.name, email: body.email, accessToken: req.header('Authorization'), socialProfile: body }).then(agent => {
                req.agent = agent;
                next();
              }).catch(err => {
                res.status(500).json(err);
              });
            }
          }).catch(err => {
            res.status(500).json(err);
          });
        });
    }
    else {
      next();
    }
  }).catch(err => {
    res.status(500).json(err);
  });
  
//  if (!req.agent) {
//    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
//  }
//  const token =
//    req.body.token ||
//    req.query.token ||
//    req.headers['x-access-token'] ||
//    req.cookies.token;
//  if (!token) {
//    res.status(401).json({ message: 'Unauthorized: No token provided' });
//  } else {
//    jwt.verify(token, process.env.CLIENT_SECRET, function(err, decoded) {
//      if (err) {
//        res.status(401).json({ message: 'Unauthorized: Invalid token' });
//      } else {
//        models.Agent.findOne({ where: { email: decoded.email } }).then(agent => {
//          req.user = agent;
//          if (!req.user) {
//            req.user = decoded;
//          }
//          next();
//        }).catch(err => {
//          res.status(500).json(err);
//        });
//      }
//    });
//  }
}
module.exports = jwtAuth;
