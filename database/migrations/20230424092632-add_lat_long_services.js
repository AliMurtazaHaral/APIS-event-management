'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.addColumn("tbl_service", "longitude", {
     * type: Sequelize.STRING, allowNull: true})
     */
    await queryInterface.addColumn("tbl_services", "longitude", {
      type: Sequelize.STRING, allowNull: true
    });
    await queryInterface.addColumn("tbl_services", "latitude", {
      type: Sequelize.STRING, allowNull: true
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
