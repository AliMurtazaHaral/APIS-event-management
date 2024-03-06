/*
 * Summary:     cart.controller file for handling all requests and response of Common
 * Author:      Openxcell(empCode-496)
 */

/*Messages,status code and services require*/
const status = require("../../config/status").status;
const message = require("../../config/web.message").appMessage;
const cart_service = require("../../services/app/cart.service");

module.exports = {

  //add cart

  async add(req, res) {
    try {
      let cart_add = await cart_service.add(req, res);
      if (cart_add) {
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
      let cart_list = await cart_service.list(req, res);
      if (cart_list) {
        res.status(status.SUCCESS_STATUS).send({
          data: cart_list,
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      }
      //response of add event
    } catch (error) {
      console.log("🚀 ~ file: cart.controller.js ~ line 52 ~ list ~ error", error)

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
    let delete_item = await cart_service.delete(req, res);
    if (delete_item) {
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
