/*
 * Summary:     service.controller file for handling all requests and response of service (customer side)
 * Author:      Openxcell(empCode-496)
 */

/*Messages,status code and services require*/
const status = require("../../../config/status").status;
const message = require("../../../config/web.message").appMessage;
const service_service = require("../../../services/app/customer/service.service");

module.exports = {
  //list service

  async list(req, res) {
    try {
      let service_list = await service_service.list(req, res);
      //response of country code
      res.status(status.SUCCESS_STATUS).send({
        data: service_list,
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
    } catch (error) {
      console.log('error', error)
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  //buy service
  
  async buyService(req, res) {
    try {
      let service_list = await service_service.buyService(req, res);
      if (service_list === 1) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.DETAILSREQUIRED,
          status: status.ERROR,
        });
      } else if (service_list.decline_code) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: service_list.raw.message,
          status: status.ERROR,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      }
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  //book service

  async bookingList(req, res) {
    try {
      let booking_list = await service_service.bookingList(req, res);
      res.status(status.SUCCESS_STATUS).send({
        data: booking_list,
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
    } catch (error) {
      console.log("🚀 ~ file: service.controller.js ~ line 196 ~ bookingList ~ error", error)

      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        error: error,
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },
};
