const express = require("express");
const router = express.Router();
const listing_controller = require("../../controllers/app/listing.controller");
const user_auth = require("../../middleware/auth").userAuthentication


router.get("/country_code",listing_controller.countryListing);
router.post("/category",user_auth,listing_controller.categoryDropdown);

module.exports = router;