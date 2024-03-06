'use strict';
const { CATEGORY_TYPE } = require("../../config/constant")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_categories", "type", {
      type: Sequelize.ENUM,
      values: Object.values(CATEGORY_TYPE)
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('tbl_categories', 'type')
  }
};
