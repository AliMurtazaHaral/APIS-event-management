var express = require("express");
var router = express.Router();

const authentication = require("../../middleware/admin_auth").authentication;
const dashboardController = require("../../controllers/cms/dashboard.controller");

router.post("/list", authentication, dashboardController.dashboard);

module.exports = router;
