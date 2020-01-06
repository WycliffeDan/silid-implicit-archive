const express = require('express');
const router = express.Router();
const jwtAuth = require('../lib/jwtAuth');
const models = require('../models');

/* GET team listing. */
router.get('/', jwtAuth, function(req, res, next) {
  req.agent.getTeams().then(teams => {
    res.status(200).json(teams);
  }).catch(err => {
    res.status(500).json(err);
  });
});

router.get('/:id', jwtAuth, function(req, res, next) {
  models.Team.findOne({ where: { id: req.params.id },
                        include: [ 'creator',
                                   { model: models.Agent, as: 'members', attributes: { exclude: ['accessToken'] } },
                                   'organization'] }).then(team => {
    if (!team) {
      return res.status(404).json({ message: 'No such team' });
    }
    let teamMembers = team.members.map(agent => agent.email);
    team.getOrganization().then(org => {
      org.getMembers().then(orgMembers => {
        orgMembers = orgMembers.map(agent => agent.email);
        if (!teamMembers.includes(req.agent.email) && !orgMembers.includes(req.agent.email)) {
          return res.status(403).json({ message: 'You are not a member of that team' });
        }
        res.status(200).json(team);
      }).catch(err => {
        res.status(500).json(err);
      });
    }).catch(err => {
      res.status(500).json(err);
    });
  }).catch(err => {
    res.status(500).json(err);
  });
});

router.post('/', jwtAuth, function(req, res, next) {
  delete req.body.token;
  models.Organization.findOne({ where: { id: req.body.organizationId } }).then(organization => {
    organization.getMembers({attributes: ['email']}).then(agents => {
      // 2019-11-1 https://github.com/sequelize/sequelize/issues/6950#issuecomment-373937803
      // Sequelize doesn't return a flat array
      agents = agents.map(agent => agent.email);
      organization.getCreator().then(creator => {

        if (creator.email !== req.agent.email && !agents.includes(req.agent.email)) {
          return res.status(401).json( { message: 'Unauthorized: Invalid token' });
        }
        req.body.creatorId = req.agent.id;

        let team = new models.Team(req.body);
        team.save().then(result => {
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
  models.Team.findOne({where: {id: req.body.id}}).then(team => {
    if (!team) {
      return res.json( { message: 'No such team' });
    }
    team.getOrganization().then(organization => {
      team.getCreator().then(teamCreator => {
        organization.getCreator().then(creator => {

          //if (creator.email !== req.agent.email && !agents.includes(req.agent.email) && teamCreator.email !== req.agent.email) {
          if (creator.email !== req.agent.email && teamCreator.email !== req.agent.email) {
            return res.status(403).json( { message: 'Unauthorized: Invalid token' });
          }
          for (let key in req.body) {
            if (team[key]) {
              team[key] = req.body[key];
            }
          }

          team.save().then(result => {
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
  models.Team.findOne({ where: { id: req.body.id } }).then(team => {
    if (!team) {
      return res.status(404).json( { message: 'No such team' });
    }

    team.getCreator().then(teamCreator => {

      team.getOrganization().then(organization => {

        organization.getCreator().then(creator => {

          if (creator.email !== req.agent.email && teamCreator.email !== req.agent.email) {
            return res.status(403).json( { message: 'Unauthorized: Invalid token' });
          }

          team.destroy().then(results => {
            res.status(201).json({ message: 'Team deleted' });
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
      res.status(500).json(err);
    });
  }).catch(err => {
    res.json(err);
  });
});

module.exports = router;
