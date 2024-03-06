const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/provider/service", require("./provider/service"));
router.use("/customer/service", require("./customer/service"));
router.use("/listing", require("./listing"));
router.use('/stripe', require("./stripe.connect"));

module.exports = router;
