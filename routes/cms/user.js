const express = require("express");
const router = express.Router();
const user_controller = require("../../controllers/cms/user.controller");
const imageMiddleware = require("../../middleware/multer");

const authentication = require("../../middleware/admin_auth").authentication;

router.post("/list", authentication, user_controller.listUser);
router.get("/view/:id", authentication, user_controller.getUserById);
router.put("/update_status/:id",authentication,user_controller.updateUserStatus);
router.put("/update/:id",imageMiddleware.singleProfilePic,authentication,user_controller.updateUser);
router.put("/approve_status/:id",authentication,user_controller.updateUserApprovalStatus); /*Update Approve status API*/
router.put("/delete/:id",authentication,user_controller.deleteUser); /*Delete User API*/
router.post("/contact_us_list", authentication, user_controller.listContactUs);

module.exports = router;
