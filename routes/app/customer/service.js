const router = require("express").Router();
const serviceController = require("../../../controllers/app/customer/service.controller");
const user_auth = require("../../../middleware/auth").userAuthentication


router.post("/list", user_auth, serviceController.list)
router.post("/buy", user_auth, serviceController.buyService)
router.post("/booking",user_auth, serviceController.bookingList)


module.exports = router;