/*
 * Summary:     event.controller file for handling all requests and response of EVENT - CMS
 * Author:      Openxcell(empCode-496)
 */

/*Messages,status code and services require*/
const status = require("../../config/status").status;
const message = require("../../config/cms.message").cmsMessage;
const event_service = require("../../services/cms/event.service");

module.exports = {
  /* List event */

  async list(req, res) {
    try {
      let event_list = await event_service.list(req, res);

      if (event_list) {
        //response of list category And Sub-category
        res.status(status.SUCCESS_STATUS).send({
          data: event_list,
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

  /* List event purchase*/

  async listEventPurchase(req, res) {
    try {
      let event_purchase_list = await event_service.listEventPurchase(req, res);

      if (event_purchase_list) {
        //response of list category And Sub-category
        res.status(status.SUCCESS_STATUS).send({
          data: event_purchase_list,
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
      console.log(
        "🚀 ~ file: event.controller.js ~ line 36 ~ list ~ error",
        error
      );
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  /* List service booking*/

  async listServiceBooking(req, res) {
    try {
      let service_booking_list = await event_service.listServiceBooking(req,res);

      if (service_booking_list) {
        //response of list category And Sub-category
        res.status(status.SUCCESS_STATUS).send({
          data: service_booking_list,
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
      console.log(
        "🚀 ~ file: event.controller.js ~ line 36 ~ list ~ error",
        error
      );
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },
};
