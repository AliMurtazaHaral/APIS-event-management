const express = require("express");
const router = express.Router();
const category_controller = require("../../controllers/cms/category.controller");
const multer_middleware = require('../../middleware/multer');
const authentication = require("../../middleware/admin_auth").authentication

router.post("/add", authentication, category_controller.addCategory);
router.put("/edit", authentication, category_controller.updateCategory)
router.get("/view/:id", authentication, category_controller.getCategoryById)
router.put("/delete", authentication, category_controller.deleteCategory);
router.post("/list", authentication, category_controller.listCategory);
router.put("/status", authentication, category_controller.updateCategoryStatus);
router.post("/dropdown",authentication,category_controller.categoryDropdown)
router.post("/uploadxlsx",authentication,multer_middleware.multiProfilePic,category_controller.uploadxlsx)

module.exports = router;