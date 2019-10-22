const User = require("../models").user;

module.exports = {
  create(req, res) {
    console.log(req.body);
    return User.create({
      name: req.body.name,
      givenname: req.body.givenname,
      familyname: req.body.familyname,
      nickname: req.body.nickname,
      email: req.body.email,
      emailverified: req.body.emailverified,
      phone: req.body.phone,
      timezone: req.body.timezone,
      locale: req.body.locale,
      isLocked: req.body.islocked,
      externalid: req.body.externalid,
      profilevisibility: req.bodyprofilevisibility,
      emailnotification: req.body.emailnotification,
      identitytoken: req.body.identitytoken,
      uilanguagebcp47: req.body.uilanguagebcp47,
      avatarurl: req.body.avatarurl,
      archived: req.body.archived,
      authid: req.body.authid
    })
      .then(user =>
        res.status(201).send({
          success: true,
          message: "Successfully created an user entity.",
          user
        })
      )
      .catch(error => res.status(500).send(error));
  },
  read(req, res) {
    return User.findAll({
      where: {
        id: req.params.id
      }
    })
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found record. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found user entity.",
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
    return User.findAll()
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found records. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found user entities.",
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
    return User.findAll({
      where: {
        authid: req.params.authid
      }
    })
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found record. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found user entity.",
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
    return User.findAll({
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
          .then(user =>
            res.status(200).send({
              success: true,
              message: "Successfully updated user entity.",
              user
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
    return User.findAll({
      where: {
        id: req.params.id
      }
    }).then(item => {
      if (item && typeof item[0] !== "undefined") {
        console.log("Found record. Deleting...");
        return User.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(user =>
            res.status(200).send({
              success: true,
              message: "Successfully deleted an user entity.",
              user
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
