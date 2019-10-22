const express = require("express");
const app = express();
const serverless = require("serverless-http");
// Load middleware
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
var cookieParser = require("cookie-parser");
// Load variables
const dotenv = require("dotenv")
dotenv.config()
console.log('Running in ' + process.env.NODE_ENV);
app.use(cookieParser());
// Enhance security
app.use(helmet());
// Enabling CORS for all requests
app.use(cors());
// Log requests to the console
app.use(logger("dev"));
// Parse incoming requests data.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup a default catch-all route that sends back a welcome message in JSON format.
require("./server/routes")(app);

app.get("*", (req, res) =>
  res.status(200).send({
    message: "transcriber-auth"
  })
);

// Un-comment for local development
// app.listen(process.env.PORT || 3000, function() {
//     console.log('Running on port 3000');
// });
// Comment for local development
module.exports.handler = serverless(app);
