const Organization = require("../models").organization;
const Membership = require("../models").membership;

module.exports = {
  create(req, res) {
    console.log(req.body);
    return Organization.create({
      guid: req.body.guid,
      uniquekey: req.body.uniquekey,
      code: req.body.code,
      name: req.body.name,
      description: req.body.description,
      logo: req.body.logo,
      verified: req.body.verified,
      verifiedby: req.body.verifiedby,
      verifieddate: req.body.verifieddate,
      active: req.body.active,
      userId: req.body.userId,
      websiteurl: req.body.websiteurl
    })
      .then(organization => {
        res.status(201).send({
          success: true,
          message: "Successfully created an organization entity.",
          organization
        });
      })
      .catch(error => res.status(500).send(error));
  },

  read(req, res) {
    return Organization.findAll({
      where: {
        id: req.params.id
      }
    })
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found record. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found organization entity.",
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
    return Organization.findAll()
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found records. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found organization entities.",
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
    return Organization.findAll({
      where: {
        uniquekey: req.params.uniquekey
      }
    })
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found record. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found organization entity.",
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
    return Organization.findAll({
      where: {
        id: req.params.id
      }
    }).then(item => {
      if (item && typeof item[0] !== "undefined") {
        console.log("Found record. Updating...");
        return Organization.update(
          {
            name: req.body.name
          },
          {
            where: {
              id: req.params.id
            }
          }
        )
          .then(organization =>
            res.status(200).send({
              success: true,
              message: "Successfully updated organization entity.",
              organization
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
    return Organization.findAll({
      where: {
        id: req.params.id
      }
    }).then(item => {
      if (item && typeof item[0] !== "undefined") {
        console.log("Found record. Deleting...");
        return Organization.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(organization =>
            res.status(200).send({
              success: true,
              message: "Successfully deleted an organization entity.",
              organization
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
