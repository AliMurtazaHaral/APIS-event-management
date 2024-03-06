
const express = require("express");
const router = express.Router();
const user_auth = require("../../../middleware/auth").userAuthentication
const cart_controller = require("../../../controllers/app/cart.controller");


router.post("/add",user_auth, cart_controller.add);
router.post("/list",user_auth, cart_controller.list);
router.delete("/delete/:id",user_auth, cart_controller.delete);



module.exports = router;