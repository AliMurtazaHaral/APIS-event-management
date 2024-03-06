/*
 * Summary:     category.controller file for handling all requests and response of CATEGORY and SUB-CATEGORY - CMS
 * Author:      Openxcell(empCode-496)
 */

/*Messages,status code and services require*/
const status = require("../../config/status").status;
const message = require("../../config/cms.message").cmsMessage;
const user_service = require("../../services/cms/user.service");

module.exports = {
  /* List Provider And customer*/

  async listUser(req, res) {
    try {
      let user_list = await user_service.listUser(req, res);

      if (user_list) {
        //response of list category And Sub-category
        res.status(status.SUCCESS_STATUS).send({
          data: user_list,
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

  /* View Provider by ID*/

  async getUserById(req, res) {
    try {
      let user_list = await user_service.getUserById(req, res);
      if (user_list) {
        //response of list category And Sub-category
        res.status(status.SUCCESS_STATUS).send({
          data: user_list,
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

  /* Update Provider Or customer status*/

  async updateUserStatus(req, res) {
    try {
      let update_user_status = await user_service.updateUserStatus(req, res);
      if (update_user_status) {
        //response of Update user status
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: "message.update",
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

   /* Update Provider Approval status*/

  async updateUserApprovalStatus(req, res) {
    try {
      let update_user_app_status = await user_service.updateUserApprovalStatus(
        req,
        res
      );
      if (update_user_app_status) {
        //response of Update user(MERCHANT) approval status
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.SUCCESS,
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
  
  /*  Delete Provider Or customer status  */

  async deleteUser(req, res) {
    try {
      let delete_user = await user_service.deleteUser(req, res);
      if (delete_user) {
        //response of delete user (soft-delete)
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.USERDELETED,
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

  /* Update Provider Or customer status*/

  async updateUser(req, res) {
    try {
      let update_user_status = await user_service.updateUser(req, res);
      if (update_user_status) {
        //response of Update user status
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: "message.update",
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



  async listContactUs(req, res) {
    try {
      let contactus_list = await user_service.listContactUs(req, res);

      if (contactus_list) {
        //response of list category And Sub-category
        res.status(status.SUCCESS_STATUS).send({
          data: contactus_list,
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
      console.log("🚀 ~ file: user.controller.js ~ line 201 ~ listContactUs ~ error", error)

      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },



};
