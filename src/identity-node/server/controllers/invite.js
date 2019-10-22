const Invite = require("../models").invite;

module.exports = {
  create(req, res) {
    console.log(req.body);
    return Invite.create({
      email: req.body.email,
      orgId: req.body.orgId,
      userId: req.body.userId
    })
      .then(data =>
        res.status(201).send({
          success: true,
          message: "Successfully created an invite entity.",
          data
        })
      )
      .catch(error => res.status(500).send(error));
  },
  read(req, res) {
    return Invite.findAll({
      where: {
        id: req.params.id
      }
    })
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found record. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found invite entity.",
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
    return Invite.findAll()
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found records. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found invite entities.",
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
    return Invite.findAll({
      where: {
        id: req.params.id
      }
    }).then(item => {
      if (item && typeof item[0] !== "undefined") {
        console.log("Found record. Updating...");
        return User.update(
          {
            name: req.body.name
          },
          {
            where: {
              id: req.params.id
            }
          }
        )
          .then(data =>
            res.status(200).send({
              success: true,
              message: "Successfully updated invite entity.",
              data
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
    return Invite.findAll({
      where: {
        id: req.params.id
      }
    }).then(item => {
      if (item && typeof item[0] !== "undefined") {
        console.log("Found record. Deleting...");
        return Invite.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(data =>
            res.status(200).send({
              success: true,
              message: "Successfully deleted an invite entity.",
              data
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
