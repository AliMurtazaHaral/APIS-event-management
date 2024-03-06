/*
 * Summary:     dashboard.controller file for handling all requests and response of DASHBOARD    - CMS
 * Author:      Openxcell(empCode-496)
 */

/*Messages,status code and services require*/
const status = require("../../config/status").status;
const message = require("../../config/cms.message").cmsMessage;
const dashboard_service = require("../../services/cms/dashboard.service");

module.exports = {
  /* List Dashboard */

  async dashboard(req, res) {
    try {
      let dashboard = await dashboard_service.dashboard(req, res);
     
        //response of count 
        res.status(status.SUCCESS_STATUS).send({
          count: dashboard,
          message: message.SUCCESS,
          status: status.SUCCESS
        });
      
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        
        message: message.INTERNALSERVERERROR,
        status: status.ERROR
      });
    }
  }
};
