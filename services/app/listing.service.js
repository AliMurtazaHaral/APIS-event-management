/*
 * Summary:     user.services file for handling all CATEGORY and SUB-CATEGORY - CMS related actions.
 * Author:      Openxcell(empCode-496)
 */

/**require NPM-modules,models and constants for configuration */
const Country = require("../../database/models").tbl_country_code;
const Category = require("../../database/models").tbl_category;

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const constant = require("../../config/constant");

module.exports = {

  //list country code

  async countryListing(req, res) {
    try {
      let country_code = await Country.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      return country_code;
    } catch (error) {
      throw error;
    }
  },

  // Category Dropdown

  async categoryDropdown(req, res) {
    let where = {
      is_deleted: false,
      is_active: true,
    }

    if (req.body.id) {
      where.parent_id = req.body.id
    }

    if (req.body.type) {
      where.type = req.body.type
    }

    let dropdown_Cat = await Category.findAll({
      where: where,
      attributes: ["category_id", "type", "category_name"],
      order: [["category_name", "ASC"]]
    });

    return dropdown_Cat;
  },
};
