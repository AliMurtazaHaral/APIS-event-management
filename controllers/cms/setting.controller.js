/*
 * Summary:     dashboard.controller file for handling all requests and response of DASHBOARD    - CMS
 * Author:      Openxcell(empCode-496)
 */

/*Messages,status code and services require*/
const status = require("../../config/status").status;
const message = require("../../config/cms.message").cmsMessage;
const setting_service = require("../../services/cms/setting.service");

module.exports = {
  /* List Dashboard */

  async list(req, res) {
    try {
      let list_setting = await setting_service.list(req, res);
      //response of list
      res.status(status.SUCCESS_STATUS).send({
        data: list_setting,
        message: message.SUCCESS,
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
  async update(req, res) {
    try {
      let update_setting = await setting_service.update(req, res);
      //response of list
      if (update_setting) {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.NOT_FOUND,
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
};
