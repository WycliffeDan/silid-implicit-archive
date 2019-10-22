const Goal = require("../models").goal;

module.exports = {
  create(req, res) {
    console.log(req.body);
    return Goal.create({
      userId: req.body.userId,
      name: req.body.name
    })
      .then(goal =>
        res.status(201).send({
          success: true,
          message: "Successfully created an goal entity.",
          goal
        })
      )
      .catch(error => res.status(500).send(error));
  },
  read(req, res) {
    return Goal.findAll({
      where: {
        id: req.params.id
      }
    })
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found record. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found goal entity.",
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
    return Goal.findAll()
      .then(data => {
        if (data && typeof data[0] !== "undefined") {
          console.log("Found records. Returning...");
          res.status(200).send({
            success: true,
            message: "Successfully found goal entities.",
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
    return Goal.findAll({
      where: {
        id: req.params.id
      }
    }).then(item => {
      if (item && typeof item[0] !== "undefined") {
        console.log("Found record. Updating...");
        return Goal.update(
          {
            name: req.body.name
          },
          {
            where: {
              id: req.params.id
            }
          }
        )
          .then(goal =>
            res.status(200).send({
              success: true,
              message: "Successfully updated goal entity.",
              goal
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
    return Goal.findAll({
      where: {
        id: req.params.id
      }
    }).then(item => {
      if (item && typeof item[0] !== "undefined") {
        console.log("Found record. Deleting...");
        return Goal.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(goal =>
            res.status(200).send({
              success: true,
              message: "Successfully deleted an goal entity.",
              goal
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
