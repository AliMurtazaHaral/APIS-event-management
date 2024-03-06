/*
 * Summary:     common.controller file for handling all requests and response of Common
 * Author:      Openxcell(empCode-496)
 */

/*Messages,status code and services require*/
const status = require("../../config/status").status;
const message = require("../../config/web.message").appMessage;
const event_service = require("../../services/app/event.services");

module.exports = {
  //add event
  async add(req, res) {
    try {
      let event_add = await event_service.add(req, res);
      if (event_add) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.EVENTADDED,
          status: status.SUCCESS,
        });
      }
      //response of add event
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: error,
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  //list event
  async list(req, res) {
    try {
      let event_list = await event_service.list(req, res);
      if (event_list) {
        res.status(status.SUCCESS_STATUS).send({
          data: event_list,
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      }
      //response of add event
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: error,
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  //view event
  async viewById(req, res) {
    try {
      let event_list = await event_service.viewById(req, res);
      if (event_list) {
        res.status(status.SUCCESS_STATUS).send({
          data: event_list,
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.NOT_FOUND,
          status: status.ERROR,
        });
      }
      //response of add event
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: error,
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  //view event purchase
  async viewEventPurchase(req, res) {
    try {
      let event_list = await event_service.viewEventPurchase(req, res);
      if (event_list) {
        res.status(status.SUCCESS_STATUS).send({
          data: event_list,
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.NOT_FOUND,
          status: status.ERROR,
        });
      }
      //response of add event
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: error,
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

   //view service purchase
   async viewServicePurchase(req, res) {
    try {
      let service_book_list = await event_service.viewServicePurchase(req, res);
      if (service_book_list) {
        res.status(status.SUCCESS_STATUS).send({
          data: service_book_list,
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.NOT_FOUND,
          status: status.ERROR,
        });
      }
      //response of add event
    } catch (error) {
      console.log("🚀 ~ file: event.controller.js ~ line 167 ~ update ~ error", error)

      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: error,
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  //update event
  async update(req, res) {
    try {
      let event_update = await event_service.update(req, res);
      if (event_update) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.EVENTUPDATED,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.NOT_FOUND,
          status: status.ERROR,
        });
      }
      //response of add event
    } catch (error) {

      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: error,
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  //stop selling event
  async stopSelling(req, res) {
    try {
      let stop_selling = await event_service.stopSelling(req, res);
      if (stop_selling) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.NOT_FOUND,
          status: status.ERROR,
        });
      }
      //response of add event
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: error,
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

   //check event sold
   async checkTicketSold(req, res) {
    try {
      let event_sold = await event_service.checkTicketSold(req, res);
      if (event_sold) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.TICKETSORSERVICEPURCHASED,
          status: status.ERROR,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      }
      //response of add event
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: error,
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },


  //buy event
  async buyEvent(req, res) {
    try {
      let event_list = await event_service.buyEvent(req, res);
      if (event_list === 1) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.TICKETSPURCHASED,
          status: status.SUCCESS,
        });
      } else if (event_list === 2) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.DETAILSREQUIRED,
          status: status.ERROR,
        });
      } else if (event_list === 3) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.OUTOFSTOCK,
          status: status.ERROR,
        });
      } else if (event_list.decline_code) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: event_list.raw.message,
          status: status.ERROR,
        });
      }
      //response of add event
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: error,
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  //list my events
  async listMyEvent(req, res) {
    try {
      let event_list = await event_service.listMyEvent(req, res);
      // if (event_list === 1) {
      res.status(status.SUCCESS_STATUS).send({
        data: event_list,
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
      // }
      //response of add event
    } catch (error) {
      //response on internal server error

      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: error,
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },
};
