/*
 * Summary:     service.controller file for handling all requests and response of service
 * Author:      Openxcell(empCode-496)
 */

/*Messages,status code and services require*/
const status = require("../../../config/status").status;
const message = require("../../../config/web.message").appMessage;
const service_service = require("../../../services/app/provider/service.service");

module.exports = {
  //add service

  async add(req, res) {
    try {
      let service_add = await service_service.add(req, res);
      //response of country code
      res.status(status.SUCCESS_STATUS).send({
        data: [],
        message: message.SERVICEADDED,
        status: status.SUCCESS,
      });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

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

  //update service

  async update(req, res) {
    try {
      let service_update = await service_service.update(req, res);
      //response of country code
      res.status(status.SUCCESS_STATUS).send({
        data: [],
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  //update service

  async viewById(req, res) {
    try {
      let service_view = await service_service.viewById(req, res);
      if (service_view) {
        //response of success
        res.status(status.SUCCESS_STATUS).send({
          data: service_view,
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.NOT_FOUND,
          status: status.ERROR,
        });
      }
    } catch (error) {
      console.log("🚀 ~ file: service.controller.js ~ line 93 ~ viewById ~ error", error)

      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  //update service

  async updateRequest(req, res) {
    try {
      let request_update = await service_service.updateRequest(req, res);
      if (request_update === 1) {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else if (request_update === 2) {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.NOT_FOUND,
          status: status.ERROR,
        });
      } else if (request_update === 3) {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else if (request_update.decline_code) {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: request_update.raw.message,
          status: status.ERROR,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.STRIPEERROR,
          status: status.ERROR,
        });
      }
    } catch (error) {
      console.log("🚀 ~ file: service.controller.js ~ line 140 ~ updateRequest ~ error", error)

      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        error: error,
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async listRequest(req, res) {
    try {
      let list_request = await service_service.listRequest(req, res);
      if (list_request) {
        //response of success
        res.status(status.SUCCESS_STATUS).send({
          data: list_request,
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.NOT_FOUND,
          status: status.ERROR,
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

  //delete service

  async deleteService(req, res) {
    try {
      await service_service.deleteService(req, res);
      //response of success
      res.status(status.SUCCESS_STATUS).send({
        data: [],
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async bookingList(req, res) {
    try {
      let booking_list = await service_service.bookingList(req, res);
      res.status(status.SUCCESS_STATUS).send({
        data: booking_list,
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
    } catch (error) {
      console.log('error ', error)
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        error: error,
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },
  async changeBookingStatus(req, res) {
    try {
      let booking_status_update = await service_service.changeBookingStatus(
        req,
        res
      );
      if (booking_status_update) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.NOT_FOUND,
          status: status.ERROR,
        });
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: service.controller.js ~ line 196 ~ bookingList ~ error",
        error
      );

      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        error: error,
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async updateBillImage(req, res) {
    try {
      let request_update = await service_service.updateBillImage(req, res);
      if (request_update) {
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
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        error: error,
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },


  async uploadRecentImages(req, res) {
    try {
      let upload_images = await service_service.uploadRecentImages(req, res);
      if (upload_images) {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.DETAILSREQUIRED,
          status: status.SUCCESS,
        });
      }
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        error: error,
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

};
