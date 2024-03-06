const express = require("express");
const router = express.Router();
const user_auth = require("../../../middleware/auth").userAuthentication
const address_controller = require("../../../controllers/app/address.controller");


router.post("/add",user_auth, address_controller.add);
router.get("/list",user_auth, address_controller.list);
router.put("/update/:id",user_auth, address_controller.update);
router.delete("/delete/:id",user_auth, address_controller.delete);



module.exports = router;