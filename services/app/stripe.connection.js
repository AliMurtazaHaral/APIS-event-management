/*
 * Summary:     user.services file for handling all CATEGORY and SUB-CATEGORY - CMS related actions.
 * Author:      Openxcell(empCode-496)
 */

/**require NPM-modules,models and constants for configuration */
const User = require("../../database/models").tbl_user;
const Category = require("../../database/models").tbl_category;

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const constant = require("../../config/constant");

module.exports = {
  async findUser(req, res) {
    let find_user = await User.findOne({
      where: {
        email: req.params.email,
      },
    });

    return find_user;
  },
  async findByAccount(req, res) {
    let find_user = await User.findOne({
      where: {
        stripe_account_id: req.body.account,
      },
    });

    return find_user;
  },
  async updateStatus(req, res, response) {
    console.log(
      "🚀 ~ file: stripe.connection.js ~ line 34 ~ updateStatus ~ response",
      response
    );
    let update_status = await User.update(
      {
        is_details_submitted: response.details_submitted,
        is_verification_done:
          response.payouts_enabled === true && response.charges_enabled === true
            ? true
            : false,
      },
      {
        where: {
          stripe_account_id: req.body.account,
        },
      }
    );
    return update_status;
  },
};
