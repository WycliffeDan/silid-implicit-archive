const express = require('express');
const router = express.Router();
const jwtAuth = require('../lib/jwtAuth');
const models = require('../models');

/* GET organization listing. */
router.get('/', jwtAuth, function(req, res, next) {
  req.agent.getOrganizations().then(orgs => {
    res.json(orgs);
  }).catch(err => {
    res.status(500).json(err);
  });
});

router.get('/:id', jwtAuth, function(req, res, next) {
  models.Organization.findOne({ where: { id: req.params.id },
                                include: [ { model: models.Agent, as: 'creator' }, { model: models.Team, as: 'teams' } ] }).then(result => {
    if (!result) {
      return res.status(404).json({ message: 'No such organization' });
    }
    res.json(result);
  }).catch(err => {
    res.json(err);
  });
});

router.post('/', jwtAuth, function(req, res, next) {
  delete req.body.token;
  req.body.creatorId = req.agent.id;
  req.agent.createOrganization(req.body).then(result => {
    res.status(201).json(result);
  }).catch(err => {
    let status = 500;
    if (err instanceof models.Sequelize.UniqueConstraintError) {
      status = 200;
    }
    res.status(status).json(err);
  });
});

router.put('/', jwtAuth, function(req, res, next) {
  models.Organization.findOne({ where: { id: req.body.id } }).then(organization => {
    if (!organization) {
      return res.json( { message: 'No such organization' });
    }

    organization.getCreator().then(creator => {
      if (req.agent.email !== creator.email) {
        return res.status(401).json( { message: 'Unauthorized: Invalid token' });
      }
  
      for (let key in req.body) {
        if (organization[key]) {
          organization[key] = req.body[key];
        }
      }
      organization.save().then(result => {
        res.status(201).json(result);
      }).catch(err => {
        res.status(500).json(err);
      });
    }).catch(err => {
      res.json(err);
    });
  }).catch(err => {
    res.json(err);
  });
});

router.delete('/', jwtAuth, function(req, res, next) {
  models.Organization.findOne({ where: { id: req.body.id } }).then(organization => {
    if (!organization) {
      return res.json( { message: 'No such organization' });
    }

    organization.getCreator().then(creator => {
      if (req.agent.email !== creator.email) {
        return res.status(401).json( { message: 'Unauthorized: Invalid token' });
      }
  
      organization.destroy().then(results => {
        res.json( { message: 'Organization deleted' });
      }).catch(err => {
        res.json(err);
      });   
    }).catch(err => {
      res.json(err);
    });
  }).catch(err => {
    res.json(err);
  });
});

module.exports = router;
