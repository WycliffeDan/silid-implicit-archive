const organizationController = require("../controllers").organization;
const membershipContoller = require("../controllers").membership;
const appController = require("../controllers").app;
const userController = require("../controllers").user;
const goalController = require("../controllers").goal;
const inviteController = require("../controllers").invite;
const emailController = require("../controllers").email;
const uploadController = require("../controllers").upload;
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

module.exports = app => {
  // JWT options
  const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: "https://dev-sillsdev.auth0.com/.well-known/jwks.json"
    }),
    audience: "https://transcriber_api",
    issuer: "https://dev-sillsdev.auth0.com/",
    algorithms: ["RS256"]
  });
  // Secure endpoints with checkJwt
  app.get("/callback", function(req, res) {
    // requestController.getClient();
    var callback = "http://" + req.param("callback");
    console.log(callback);
    // Set cookie
    // res.cookie('nonce',req.param('nonce'));
    // console.log('test:',req.param('nonce'));
    // res.localStorage.setItem('nonce', req.param('nonce'));

    res.writeHead(302, { Location: callback + "/callback" });

    res.end();
  });

  app.get("/api", (req, res) =>
    res.status(200).send({
      message: "Welcome to the API!"
    })
  );
  // Organization Endpoints
  // Create
  app.post("/api/organization", checkJwt, organizationController.create);
  app.post("/api/uploadLogo", checkJwt, uploadController.uploadLogo);
  // Read
  app.get(
    "/api/organization/:id(\\d+)/",
    checkJwt,
    organizationController.read
  );
  app.get("/api/organizations/", checkJwt, organizationController.readAll);
  app.get(
    "/api/organization/:uniquekey",
    checkJwt,
    organizationController.readKey
  );
  // Update
  app.put("/api/organization/:id", checkJwt, organizationController.update);
  // Delete
  app.delete("/api/organization/:id", checkJwt, organizationController.delete);

  // Membership Endpoints
  // Create
  app.post("/api/membership", checkJwt, membershipContoller.create);
  // Read
  app.get("/api/membership/:id(\\d+)/", checkJwt, membershipContoller.read);
  app.get("/api/memberships/", checkJwt, membershipContoller.readAll);
  // app.get("/api/membership/:uniquekey", checkJwt ,membershipContoller.readKey);
  // Update
  app.put("/api/membership/:id", checkJwt, membershipContoller.update);
  // Delete
  app.delete("/api/membership/:id", checkJwt, membershipContoller.delete);

  // App Endpoints
  // Create
  app.post("/api/app", checkJwt, appController.create);
  // Read
  app.get("/api/app/:id(\\d+)/", checkJwt, appController.read);
  app.get("/api/apps/", checkJwt, appController.readAll);
  app.get("/api/app/:uniquekey", checkJwt, appController.readKey);
  // Update
  app.put("/api/app/:id", checkJwt, appController.update);
  // Delete
  app.delete("/api/app/:id", checkJwt, appController.delete);

  // User Endpoints
  // Create
  app.post("/api/user", checkJwt, userController.create);
  // Read
  app.get("/api/user/:id(\\d+)/", checkJwt, userController.read);
  app.get("/api/users/", checkJwt, userController.readAll);
  app.get("/api/user/:authid", checkJwt, userController.readKey);
  // Update
  app.put("/api/user/:id", checkJwt, userController.update);
  // Delete
  app.delete("/api/user/:id", checkJwt, userController.delete);

  // Goal Endpoints
  // Create
  app.post("/api/goal", checkJwt, goalController.create);
  // Read
  app.get("/api/goal/:id(\\d+)/", checkJwt, goalController.read);
  app.get("/api/goals/", checkJwt, goalController.readAll);
  // Update
  app.put("/api/goal/:id", checkJwt, goalController.update);
  // Delete
  app.delete("/api/goal/:id", checkJwt, goalController.delete);

  // Invite Endpoints
  // Create
  app.post("/api/invite", checkJwt, inviteController.create);
  app.post("/api/sendEmail", checkJwt, emailController.sendEmail);
  // Read
  app.get("/api/invite/:id(\\d+)/", checkJwt, inviteController.read);
  app.get("/api/invites/", checkJwt, inviteController.readAll);
  // Update
  app.put("/api/invite/:id", checkJwt, inviteController.update);
  // Delete
  app.delete("/api/invite/:id", checkJwt, inviteController.delete);
};
