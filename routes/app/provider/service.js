
const router = require("express").Router();
const serviceController = require("../../../controllers/app/provider/service.controller");
const user_auth = require("../../../middleware/auth").userAuthentication

const multerMiddleware = require("../../../middleware/multer");

router.post("/add",multerMiddleware.singleProfilePic, user_auth, serviceController.add)
router.post("/list", user_auth, serviceController.list)
router.put("/update/:id",user_auth, multerMiddleware.singleProfilePic, serviceController.update)
router.get("/view/:id",user_auth, serviceController.viewById)
router.put("/delete/:id",user_auth, serviceController.deleteService)
router.post("/request/list",user_auth, serviceController.listRequest)
router.put("/request/respond/:id",user_auth, serviceController.updateRequest)
router.post("/booking",user_auth, serviceController.bookingList)
router.put("/update_booking_status/:id",user_auth, serviceController.changeBookingStatus)
router.put("/bill_image/:id",user_auth, serviceController.updateBillImage)
router.post("/upload_images",user_auth, serviceController.uploadRecentImages)




module.exports = router;