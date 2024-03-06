/*
 * Summary:     event.services file for handling all event related actions.
 * Author:      Openxcell(empCode-496)
 */

/**require NPM-modules,models and constants for configuration */
const User = require("../../database/models").tbl_user;
const Address = require("../../database/models").tbl_user_address;

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const constant = require("../../config/constant");
const imageupload = require("../../middleware/multer_aws_upload");
const imageDelete = require("../../middleware/multer_aws_delete");

module.exports = {
  /* add */

  async add(req, res) {
    let { address, latitude, type, longitude } = req.body;

    let add_address = await Address.create({
      address: address,
      type: type,
      latitude: latitude,
      longitude: longitude,
      user_id: req.user_id,
    });

    return add_address;
  },

  //list
  async list(req, res) {
    let find_address = await Address.findAll({
      where: { user_id: req.user_id },
      attributes: { exclude: ["updatedAt"] },
      order: [["createdAt", "DESC"]],
    });
    return find_address;
  },

  //update
  async update(req, res) {
    let { address, latitude, type, longitude } = req.body;
    let update_address = await Address.update(
      {
        address: address,
        type: type,
        latitude: latitude,
        longitude: longitude,
      },
      {
        where: {
          address_id: req.params.id,
        },
      }
    );
    return update_address;
  },

  //delete
  async delete(req, res) {
    let delete_address = await Address.destroy({
      where: {
        address_id: req.params.id,
      },
    });
    return delete_address;
  },
};
