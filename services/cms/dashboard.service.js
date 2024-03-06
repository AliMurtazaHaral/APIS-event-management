/*
 * Summary:     dashboard.services file for handling all DASHBOARD  - CMS related actions.
 * Author:      Openxcell(empCode-496)
 */

/**require NPM-modules,models and constants for configuration */
const User = require("../../database/models").tbl_user;
const Category = require("../../database/models").tbl_category;

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {
  /*  List Dashboard */

  async dashboard(req, res) {
    let data = {};
    let provider = await User.count({
      where: {
        type: "provider",
        is_deleted:false,
        is_email_verified:true,
      },
    });
    let customer = await User.count({
      where: {
        type: "customer",
        is_deleted:false,
        is_email_verified:true,
      },
    });
    let category = await Category.count({
      where: {
        parent_id: null,
        is_deleted:false
      },
    });
    let sub_category = await Category.count({
      where: {
        parent_id: {[Op.ne]:[null]},
        is_deleted:false
      },
    });
    data.provider = provider;
    data.customer = customer;
    data.category = category;
    data.sub_category = sub_category;
    return data;
  },
};
