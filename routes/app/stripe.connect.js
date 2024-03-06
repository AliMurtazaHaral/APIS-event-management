const express = require("express");
const router = express.Router();
const stripe_controller = require("../../controllers/app/stripe.controller");


router.post("/add_account", stripe_controller.addAccount);
router.get("/create_connect/:email", stripe_controller.createConnectAcc);
router.get("/updateAccLink", stripe_controller.addAccount);
router.post("/webhook-update-account", express.raw({ type: "application/json" }), stripe_controller.accountUpdateWebHook);

module.exports = router;