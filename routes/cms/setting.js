var express = require("express");
var router = express.Router();

/* require for Authentication */
const authentication = require("../../middleware/admin_auth").authentication;

/* require for Controller */
const settingController = require("../../controllers/cms/setting.controller");

/* route of Settings */
router.post(
  "/list",
  authentication,
  settingController.list
); /*List settings API*/

router.put(
    "/update/:id",
    authentication,
    settingController.update
  ); /*Update settings API*/
  

module.exports = router;
