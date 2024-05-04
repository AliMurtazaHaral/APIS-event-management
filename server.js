// PARSE .ENV
require('dotenv').config();

// FOR SERVER
// CHECK WITH PROTOCOL TO USE
const http = require('http')

const express = require('express') // NODE FRAMEWORK
const bodyParser = require('body-parser') // TO PARSE POST REQUEST
const cors = require('cors') // ALLOW CROSS ORIGIN REQUESTS

// ---------------------------    SERVER CONFIGS ----------------------------------
const port = process.env.PORT || 8000
const app = express();
const actuator = require('express-actuator');

require('./config/global'); // GLOBAL SETTINGS FILES

const server = http.createServer(app)

// ------------------------ GLOBAL MIDDLEWARE -------------------------
app.use(actuator({ infoGitMode: 'full' }));
app.use(bodyParser.urlencoded({ extended: false })) // ALLOW URL ENCODED PARSER
app.use(cors()) // ALLOWED ALL CROSS ORIGIN REQUESTS
app.use(require("morgan")("dev")); // view engine setup

// ALLOW APPLICATION JSON
app.use((req, res, next) => {
  console.log('req.originalUrl', req.originalUrl)
  if (req.originalUrl === "/app-api/stripe/webhook-update-account") {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

// ------------------------    Cron job    -------------------
require('./config/cron_job');

// --------------------------    ROUTES    ------------------
const appRoutes = require("./routes");
appRoutes(app)

// --------------------------    START SERVER    ---------------------
server.listen(port, () => {
  console.log(`\nServer started on ${port} :) \n`)
})