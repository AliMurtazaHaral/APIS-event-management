/*
 * Summary:     category.controller file for handling all requests and response of CATEGORY and SUB-CATEGORY - CMS
 * Author:      Openxcell(empCode-496)
 */

/*Messages,status code and services require*/
const status = require("../../config/status").status;
const message = require("../../config/web.message").appMessage;
const stripe_service = require("../../services/app/stripe.connection");
const Stripe = require("../../helper/stripe");
const constat = require("../../config/constant");
const { createWebhook } = require("../../helper/stripe");
const User = require("../../database/models").tbl_user;
module.exports = {
  //list country code

  async addAccount(req, res) {
    try {
      let find_account = await stripe_service.findByAccount(req, res);

      let response = await Stripe.retriveAccount(
        find_account.stripe_account_id
      );
        console.log('respones', response.details_submitted)
      if (!response.details_submitted) {
        let response_url = await Stripe.createAccontLink(
          find_account.stripe_account_id,
          `${constat.WEB_SITE_URL}`,
          `${constat.API_URL}stripe/create_connect/${find_account.email}`,
        );

        res.status(status.SUCCESS_STATUS).send({
          data: response_url.url,
          message: message.REDIRECTURL,
          status: status.SUCCESS,
        });
      } else {
        await stripe_service.updateStatus(req, res, response);

        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.UPDATED,
          status: status.SUCCESS,
        });
      }
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: error,
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async createConnectAcc(req, res) {
    try {
      let find_account = await stripe_service.findUser(req, res);

      let response = await Stripe.retriveAccount(
        find_account.stripe_account_id
      );

      if (!response.details_submitted) {
        let response_url = await Stripe.createAccontLink(
          find_account.stripe_account_id,
          `${constat.WEB_SITE_URL}`,
          `${constat.API_URL}stripe/create_connect/${find_account.email}`,
        );

        res.status(status.SUCCESS_STATUS).send({
          data: response_url.url,
          message: message.REDIRECTURL,
          status: status.SUCCESS,
        });
      } else if (req.query.email) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.LINKEXPIRE,
          status: status.ERROR,
        });
      } else {
        let response_url = await Stripe.getConnAccLink(
          find_account.stripe_account_id
        );
          console.log('respnoes url object', response_url);
        res.status(status.SUCCESS_STATUS).send({
          data: response_url.url,
          message: message.UPDATED,
          status: status.SUCCESS,
        });
      }
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: error,
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async accountUpdateWebHook (req, res) {
    try {
        const sig = req.headers['stripe-signature'];
        const accountObj =  await createWebhook(req.body ,sig);
       if (accountObj === 0) {
        return res.status(401).send({
          data: [],
          message: "Unhandled Event Of Webhook",
          status: status.ERROR
        });
       } else {
        let [update_status] = await User.update(
          {
            is_verification_done: 
              (accountObj.payouts_enabled === true && accountObj.charges_enabled === true)
                ? true
                : false,
          },
          {
            where: {
              stripe_account_id: accountObj.id,
            },
          }
        );
        if (update_status !== 0) {
          return res.status(200).send({
            message: "Account Updated Successfully",
            data: [],
            status: status.SUCCESS
          });
        } else {
          return res.status(401).send({
            message: "Unable to update the account",
            data: [],
            status: status.ERROR
          })
        }
       }
    } catch (e) {
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: e,
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  }
};
