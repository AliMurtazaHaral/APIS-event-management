/*
 * Summary:     event.js file for handling all routes, request and response for app.
 * Author:      Openxcell(empCode-496)
 */

/**require NPM-modules for configuration */
const express = require("express");
const router = express.Router();
const user_auth = require("../../../middleware/auth").userAuthentication
const event_controller = require("../../../controllers/app/event.controller");
const imageMiddleware = require("../../../middleware/multer");

//--for sell event---
router.post("/add",user_auth, event_controller.add);
router.post("/list",user_auth, event_controller.list);
router.get("/view/:id",user_auth, event_controller.viewById);//:id of perticular event
router.put("/update/:id",user_auth, event_controller.update); //:id of perticular event
router.put("/stop_sell/:id",user_auth, event_controller.stopSelling); //:id of perticular event
router.get("/check_ticket_sold/:id",user_auth, event_controller.checkTicketSold);

//---for purchase event---
router.post("/buy",user_auth, event_controller.buyEvent);
router.get("/view_event_purchase/:id",user_auth, event_controller.viewEventPurchase);//:id of perticular event purchase
router.get("/view_service_purchase/:id",user_auth, event_controller.viewServicePurchase);//:id of perticular service purchase

//---for listing events---
router.post("/list_myevent",user_auth, event_controller.listMyEvent);


module.exports = router;