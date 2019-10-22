var assert = require("assert");
var request = require("request");
var fs = require("fs");

describe("Create, Read, Delete", function() {
  this.timeout(5000);
  it("should create a new organization, read it, & delete it", function(done) {
    // Build and log the path
    // var path = "https://" + process.env.TODOS_ENDPOINT + "/todos";
    var options = {
      method: "POST",
      url: "https://dev-silsdev.auth0.com/oauth/token",
      headers: { "content-type": "application/json" },
      body:
        '{"client_id":"pTWGZ8khDCO9KbXPbIPMgVc617M4xtbR","client_secret":"PDaI4NRZoaweXWTn9WuAqPYViN-IhKRjeQHUNRcE1ut10xNvlXJrirEywLUftIV0","audience":"https://transcriber-auth","grant_type":"client_credentials"}'
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      body = JSON.parse(body);
      var token = body.access_token;
      var path =
        "https://dct0y3d7gl.execute-api.us-east-1.amazonaws.com/dev/api/organization";
      // Fetch the comparison payload
      require.extensions[".txt"] = function(module, filename) {
        module.exports = fs.readFileSync(filename, "utf8");
      };
      var desiredPayload = require("./data/organization.json");
      // Create the new todo
      var options = {
        url: path,
        form: desiredPayload,
        headers: { authorization: "Bearer " + token }
      };
      request.post(options, function(err, res, body) {
        if (err) {
          throw new Error("Create call failed: " + err);
        }
        assert.equal(
          201,
          res.statusCode,
          "Create Status Code != 201 (" + res.statusCode + ")"
        );
        done();
        var organization = JSON.parse(res.body).organization;
        // Read the item
        var specificPath = path + "/" + organization.id;
        var options = {
          url: specificPath,
          headers: { authorization: "Bearer " + token }
        };

        request.get(options, function(err, res, body) {
          if (err) {
            throw new Error("Read call failed: " + err);
          }
          assert.equal(
            200,
            res.statusCode,
            "Read Status Code != 200 (" + res.statusCode + ")"
          );

          var organization = JSON.parse(res.body);
          var options = {
            url: specificPath,
            headers: { authorization: "Bearer " + token }
          };

          if ((organization.name = desiredPayload.name)) {
            // Item found, delete it
            request.del(options, function(err, res, body) {
              if (err) {
                throw new Error("Delete call failed: " + err);
              }
              assert.equal(
                200,
                res.statusCode,
                "Delete Status Code != 200 (" + res.statusCode + ")"
              );
            });
          } else {
            // Item not found, fail test
            assert.equal(true, false, "New item not found in list.");
            done();
          }
        });
      });
    });
  });
});
