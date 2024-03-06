/*
 * Summary:     category.controller file for handling all requests and response of CATEGORY and SUB-CATEGORY - CMS
 * Author:      Openxcell(empCode-496)
 */

/*Messages,status code and services require*/
const status = require("../../config/status").status;
const message = require("../../config/web.message").appMessage;
const listing_service = require("../../services/app/listing.service");

module.exports = {
  //list country code

  async countryListing(req, res) {
    try {
      let countries = await listing_service.countryListing(req, res);
      //response of country code
      res.status(status.SUCCESS_STATUS).send({
        data: countries,
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

  //category and subcategory listing for create services

  async categoryDropdown(req, res) {
    try {
      let category_List = await listing_service.categoryDropdown(req, res);

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
};
