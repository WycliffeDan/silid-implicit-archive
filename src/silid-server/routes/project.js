const express = require('express');
const router = express.Router();
const jwtAuth = require('../lib/jwtAuth');
const models = require('../models');

/* GET project listing. */
router.get('/', jwtAuth, function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id', jwtAuth, function(req, res, next) {
  models.Project.findOne({ where: { id: req.params.id } }).then(result => {
    if (!result) {
      result = { message: 'No such project' };
    }
    res.json(result);
  }).catch(err => {
    res.json(err);
  });
});

router.post('/', jwtAuth, function(req, res, next) {
  delete req.body.token;
  models.Organization.findOne({ where: { id: req.body.organizationId } }).then(organization => {
    organization.getAgents({attributes: ['email']}).then(agents => {
      // 2019-11-1 https://github.com/sequelize/sequelize/issues/6950#issuecomment-373937803
      // Sequelize doesn't return a flat array
      agents = agents.map(agent => agent.email);
      organization.getCreator().then(creator => {

        if (creator.email !== req.user.email && !agents.includes(req.user.email)) {
          return res.status(401).json( { message: 'Unauthorized: Invalid token' });
        }

        let project = new models.Project(req.body);
        project.save().then(result => {
          res.status(201).json(result);
        }).catch(err => {
          let status = 500;
          if (err instanceof models.Sequelize.UniqueConstraintError) {
            status = 200;
          }
          res.status(status).json(err);
        });
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

router.put('/', jwtAuth, function(req, res, next) {
  models.Project.findOne({where: {id: req.body.id}}).then(project => {
    if (!project) {
      return res.json( { message: 'No such project' });
    }
    project.getOrganization().then(organization => {
      
      organization.getAgents({attributes: ['email']}).then(agents => {
        agents = agents.map(agent => agent.email);
        organization.getCreator().then(creator => {

          if (creator.email !== req.user.email && !agents.includes(req.user.email)) {
            return res.status(401).json( { message: 'Unauthorized: Invalid token' });
          }
          for (let key in req.body) {
            if (project[key]) {
              project[key] = req.body[key];
            }
          }
          project.save().then(result => {
            res.status(201).json(result);
          }).catch(err => {
            res.status(500).json(err);
          });
        }).catch(err => {
          res.status(500).json(err);
        });
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
  models.Project.findOne({ where: { id: req.body.id } }).then(project => {
    if (!project) {
      return res.json( { message: 'No such project' });
    }

    project.getOrganization().then(organization => {

      organization.getCreator().then(creator => {

        if (creator.email !== req.user.email) {
          return res.status(401).json( { message: 'Unauthorized: Invalid token' });
        }

        project.destroy().then(results => {
          res.json({ message: 'Project deleted' });
        }).catch(err => {
          res.json(err);
        });
      }).catch(err => {
        res.status(500).json(err);
      });
    }).catch(err => {
      res.status(500).json(err);
    });
  }).catch(err => {
    res.json(err);
  });
});

module.exports = router;
