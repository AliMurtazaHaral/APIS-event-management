/*
 * Summary:     category.controller file for handling all requests and response of CATEGORY and SUB-CATEGORY - CMS
 * Author:      Openxcell(empCode-496)
 */

/*Messages,status code and services require*/
const status = require("../../config/status").status;
const message = require("../../config/cms.message").cmsMessage;
const categoryService = require("../../services/cms/category.service");

module.exports = {
  /* Add Category And Sub-category */

  async addCategory(req, res) {
    try {
      let category = await categoryService.addCategory(req, res);
      if (category === 1) {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.CATEGORYEXIST,
          status: status.ERROR,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.CATEGORYADDED,
          status: status.SUCCESS,
        });
      }
      //response of add category And Sub-category
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  /* List Category */

  async listCategory(req, res) {
    try {
      let category_List = await categoryService.listCategory(req, res);

      if (category_List) {
        //response of list category And Sub-category
        res.status(status.SUCCESS_STATUS).send({
          data: category_List,
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.NORECORDFOUND,
          status: status.ERROR,
        });
      }
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  /* View Category */

  async getCategoryById(req, res) {
    try {
      view_cat = await categoryService.getCategoryById(req, res);
      if (view_cat) {
        //respnse of view category And Sub-category
        res.status(status.SUCCESS_STATUS).send({
          data: view_cat,
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.NORECORDFOUND,
          status: status.error,
        });
      }
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async categoryDropdown(req, res) {
    try {
      let category_List = await categoryService.categoryDropdown(req, res);

      if (category_List) {
        //respnse of Dropdown of category And Sub-category
        res.status(status.SUCCESS_STATUS).send({
          data: category_List,
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.NORECORDFOUND,
          status: status.ERROR,
        });
      }
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  /* Update Category And Sub-category */

  async updateCategory(req, res) {
    try {
      let update_cat = await categoryService.updateCategory(req, res);
      if (update_cat === 1) {
        //respnse of update category And Sub-category
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.CATEGORYEXIST,
          status: status.ERROR,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.CATEGORYUPDATED,
          status: status.SUCCESS,
        });
      }
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  /* Update Category And Sub-category Status */

  async updateCategoryStatus(req, res) {
    try {
      let update_cat_status = await categoryService.updateCategoryStatus(
        req,
        res
      );
      if (update_cat_status) {
        //response on status change
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.PARENTCATEGORYINACTIVE,
          status: status.ERROR,
        });
      }
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.internalServerError,
        status: status.error,
      });
    }
  },

  /* Delete Category */

  async deleteCategory(req, res) {
    try {
      //response on delete category (soft-delete)
      let delete_cat = await categoryService.deleteCategory(req, res);
      if (delete_cat) {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.CATEGORYDELETED,
          status: status.SUCCESS,
        });
      }
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async uploadxlsx(req, res) {
    try {
      let category_List = await categoryService.uploadxlsx(req, res);

      //respnse of Dropdown of category And Sub-category
      res.status(status.SUCCESS_STATUS).send({
        data: [],
        message: message.CATEGORYADDED,
        status: status.SUCCESS,
      });
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },
};
