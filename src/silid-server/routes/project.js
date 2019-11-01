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
//  req.body.creatorId = req.user.id;
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
});

router.put('/', jwtAuth, function(req, res, next) {
console.log('WORD UP');
  models.Project.findOne({where: {id: req.body.id}}, {
//    include: [
//      {
//        model: models.Organization,
//        required: true,
//      }
//    ]
  }).then(project => {
    if (!project) {
      return res.json( { message: 'No such project' });
    }
    project.getOrganization().then(organization => {
      console.log(organization);
      
      organization.getAgents({attributes: ['id']})).then(agents => {
        organization.getCreator().then(creator => {
          console.log(creator);

          if (creator.email !== req.user.email && !agents.include(req.user.id)) {
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

    project.getCreator().then(creator => {
      if (req.user.email !== creator.email) {
        return res.status(401).json( { message: 'Unauthorized: Invalid token' });
      }
  
      project.destroy().then(results => {
        res.json( { message: 'Project deleted' });
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
