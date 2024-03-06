const express = require("express");
const router = express.Router();

const user_auth = require("../../../middleware/auth").userAuthentication
const common_controller = require("../../../controllers/app/common.controller");
const imageMiddleware = require("../../../middleware/multer");


router.post("/login", common_controller.login);
router.post("/signup", imageMiddleware.singleProfilePic, common_controller.signup);
router.post("/forgot_password", common_controller.forgotPassword);
router.post("/reset_password", common_controller.resetPassword);
router.get("/email-verify/:token_iv/:token_enc/:verification_token", common_controller.emailVerification);
router.put("/purchase", common_controller.planPurchase);
router.get("/check_plan_validity", user_auth, common_controller.planValidity);
router.get("/view/:id", user_auth, common_controller.viewById);
router.get("/view", user_auth, common_controller.viewByToken); //by token

router.put("/update_bankdetail", user_auth, common_controller.updateBankDetail);
router.put("/update", imageMiddleware.singleProfilePic, user_auth, common_controller.updateProfile);
router.post("/contact_us", user_auth, common_controller.contactUs);
router.delete("/logout", user_auth, common_controller.logout);
router.post("/static_content", common_controller.staticPages);
router.get("/setting", user_auth, common_controller.setting);
router.post("/add_review", user_auth, common_controller.addReview);
router.put("/change_password", user_auth, common_controller.changePassword);
router.get("/earning", user_auth, common_controller.earning);
router.get("/transaction", user_auth, common_controller.transaction);
router.post("/notification_list", user_auth, common_controller.notificationList);
router.get("/notification_status", user_auth, common_controller.notificationStatusChange);
router.get("/review_list/:id", user_auth, common_controller.reviewList);
router.patch('/updateVerifyStatus', user_auth, common_controller.updateUserVerification);
router.post('/register_mail_client', common_controller.postMailToClient);
router.post('/delete', common_controller.deleteUserAccountAndDetails);

router.use("/event", require("./event"));
router.use("/cart", require("./cart"));
router.use("/address", require("./address"));

module.exports = router;
