const Membership = require("../models").membership;
const User = require("../models").user;

module.exports = {
  create(req, res) {
    console.log(req.body);
    return Membership.create({
      orgId: req.body.orgId,
      userId: req.body.userId
    })
      .then(membership => {
        res.status(201).send({
          success: true,
          message: "Successfully created an membership entity.",
          membership
        });
      })
      .catch(error => res.status(500).send(error));
  },
  read(req, res) {
    return Membership.findAll({
      where: {
        id: req.params.id
      }
    })
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found record. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found membership entity.",
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
    return Membership.findAll()
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found records. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found membership entities.",
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
    return Membership.findAll({
      where: {
        authid: req.params.authid
      }
    })
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found record. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found membership entity.",
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
    return Membership.findAll({
      where: {
        id: req.params.id
      }
    }).then(item => {
      if (item && typeof item[0] !== "undefined") {
        console.log("Found record. Updating...");
        return Membership.update(
          {
            name: req.body.name
          },
          {
            where: {
              id: req.params.id
            }
          }
        )
          .then(membership =>
            res.status(200).send({
              success: true,
              message: "Successfully updated membership entity.",
              membership
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
    return Membership.findAll({
      where: {
        id: req.params.id
      }
    }).then(item => {
      if (item && typeof item[0] !== "undefined") {
        console.log("Found record. Deleting...");
        return membership
          .destroy({
            where: {
              id: req.params.id
            }
          })
          .then(membership =>
            res.status(200).send({
              success: true,
              message: "Successfully deleted an membership entity.",
              membership
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
