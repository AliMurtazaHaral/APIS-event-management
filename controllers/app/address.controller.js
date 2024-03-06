/*
 * Summary:     cart.controller file for handling all requests and response of Common
 * Author:      Openxcell(empCode-496)
 */

/*Messages,status code and services require*/
const status = require("../../config/status").status;
const message = require("../../config/web.message").appMessage;
const address_service = require("../../services/app/address.service");

module.exports = {

  //add cart

  async add(req, res) {
    try {
      let address_add = await address_service.add(req, res);
      if (address_add) {
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
        error:error,
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  //list cart
  async list(req, res) {
    try {
      let address_list = await address_service.list(req, res);
      if (address_list) {
        res.status(status.SUCCESS_STATUS).send({
          data: address_list,
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      }
      //response of add event
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error:error,
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },


   //update address item
 async update(req, res) {
  try {
    let update_item = await address_service.update(req, res);
    if (update_item) {
      res.status(status.SUCCESS_STATUS).send({
        data: {},
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
    }else{
      res.status(status.SUCCESS_STATUS).send({
        data: {},
        message: message.NOT_FOUND,
        status: status.ERROR,
      });
    }
    
  } catch (error) {
    //response on internal server error
    res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
      error:error,
      data: {},
      message: message.INTERNALSERVERERROR,
      status: status.ERROR,
    });
  }
},



 //delete cart item
 async delete(req, res) {
  try {
    let delete_addrress = await address_service.delete(req, res);
    if (delete_addrress) {
      res.status(status.SUCCESS_STATUS).send({
        data: {},
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
    }else{
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
      error:error,
      data: {},
      message: message.INTERNALSERVERERROR,
      status: status.ERROR,
    });
  }
},



};
