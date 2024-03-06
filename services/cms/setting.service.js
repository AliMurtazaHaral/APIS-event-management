/*
 * Summary:     dashboard.services file for handling all DASHBOARD  - CMS related actions.
 * Author:      Openxcell(empCode-496)
 */

/**require NPM-modules,models and constants for configuration */
const Setting = require("../../database/models").tbl_setting;

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const constant = require("../../config/constant");

module.exports = {
  /*  List Dashboard */

  async list(req, res) {
    let { sort_by, order, search, page } = req.body;
    const offset = (page - 1) * constant.LIMIT;
    const limit = constant.LIMIT;
    search = search === undefined ? "" : search;

    let list_setting = await Setting.findAndCountAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
      order: [[Sequelize.literal(`${sort_by}`), `${order}`]],
      attributes: {
        exclude: ["updatedAt"],
      },
      offset: offset,
      limit: limit,
    });
    return list_setting;
  },
  async update(req, res) {
    let update_setting = await Setting.update(
      {
        value: req.body.value,
      },
      {
        where: {
          setting_id: req.params.id,
        },
      }
    );
    return update_setting
  },
};
