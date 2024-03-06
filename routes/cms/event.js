const express = require("express");
const router = express.Router();
const event_controller = require("../../controllers/cms/event.controller");
const authentication = require("../../middleware/admin_auth").authentication


router.post("/list", authentication, event_controller.list);
router.post("/event_purchase_list", authentication, event_controller.listEventPurchase);
router.post("/service_booking_list", authentication, event_controller.listServiceBooking);


module.exports = router;