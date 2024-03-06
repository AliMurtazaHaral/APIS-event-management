var express = require("express");
var router = express.Router();

const authentication = require("../../middleware/admin_auth").authentication;
const multer_middleware = require('../../middleware/multer');

const admin_controller = require("../../controllers/cms/admin.controller");

router.post("/login", admin_controller.signIn);
router.delete("/logout", authentication, admin_controller.signOut);

router.post("/forgot-password", admin_controller.forgotPassword);
router.post("/reset-password", admin_controller.resetPassword);
router.post("/edit-profile", authentication, multer_middleware.singleProfilePic, admin_controller.updateProfile);
router.post("/change-password", authentication, admin_controller.changePassword);


router.use("/category", require("./category"))
router.use("/user", require("./user"))
router.use("/dashboard", require("./dashboard"))
router.use("/setting", require("./setting"))
router.use("/event", require("./event"))
router.use("/static-content", require("./static.content"))


module.exports = router;
