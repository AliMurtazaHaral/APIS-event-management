const express = require("express");
const router = express.Router();

const authentication = require("../../middleware/admin_auth").authentication;
const admin_controller = require("../../controllers/cms/admin.controller");

router.post("/add", authentication, admin_controller.addStaticPage);
router.put("/edit/:id", authentication, admin_controller.editStaticPage);
router.post("/list", authentication, admin_controller.listStaticPage);
router.post("/update-status", authentication, admin_controller.changeStatusStaticPage);


module.exports = router;