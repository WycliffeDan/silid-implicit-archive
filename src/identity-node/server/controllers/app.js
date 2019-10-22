const App = require("../models").app;

module.exports = {
  create(req, res) {
    console.log(req.body);
    return App.create({
      guid: req.body.guid,
      uniquekey: req.body.uniquekey,
      name: req.body.name,
      orgsMustVerify: req.body.orgsMustVerify,
      usersMustVerify: req.body.usersMustVerify,
      orgVerificationEmail: req.body.orgVerificationEmail,
      userVerificationEmail: req.body.userVerificationEmail,
      orgCreationEndpoint: req.body.orgCreationEndpoint,
      userCreationEndpoint: req.body.userCreationEndpoint,
      active: req.body.active
    })
      .then(app =>
        res.status(201).send({
          success: true,
          message: "Successfully created an app entity.",
          app
        })
      )
      .catch(error => res.status(500).send(error));
  },
  read(req, res) {
    return App.findAll({
      where: {
        id: req.params.id
      }
    })
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found record. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found app entity.",
            data
          });
        } else {
          res.status(404).send({
            success: false,
            message: "Not found!"
          });
        }
      })
      .catch(error => res.status(500).send(error));
  },
  readAll(req, res) {
    return App.findAll()
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found records. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found app entities.",
            data
          });
        } else {
          res.status(404).send({
            success: false,
            message: "Not found!"
          });
        }
      })
      .catch(error => res.status(500).send(error));
  },
  readKey(req, res) {
    return App.findAll({
      where: {
        uniquekey: req.params.uniquekey
      }
    })
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found record. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found app entity.",
            data
          });
        } else {
          res.status(404).send({
            success: false,
            message: "Not found!"
          });
        }
      })
      .catch(error => res.status(500).send(error));
  },
  update(req, res) {
    return App.findAll({
      where: {
        id: req.params.id
      }
    }).then(item => {
      if (item && typeof item[0] !== "undefined") {
        console.log("Found record. Updating...");
        return App.update(
          {
            name: req.body.name
          },
          {
            where: {
              id: req.params.id
            }
          }
        )
          .then(app =>
            res.status(200).send({
              success: true,
              message: "Successfully updated app entity.",
              app
            })
          )
          .catch(error => res.status(500).send(error));
      } else {
        res.status(404).send({
          success: false,
          message: "Not found!"
        });
      }
    });
  },
  delete(req, res) {
    return App.findAll({
      where: {
        id: req.params.id
      }
    }).then(item => {
      if (item && typeof item[0] !== "undefined") {
        console.log("Found record. Deleting...");
        return App.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(app =>
            res.status(200).send({
              success: true,
              message: "Successfully deleted an app entity.",
              app
            })
          )
          .catch(error => res.status(500).send(error));
      } else {
        res.status(404).send({
          success: false,
          message: "Not found!"
        });
      }
    });
  }
};
