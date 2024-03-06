"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tbl_services", {
      service_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_users", key: "user_id" },
        onDelete: "CASCADE",
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_categories", key: "category_id" },
        onDelete: "CASCADE",
      },
      sub_category_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_categories", key: "category_id" },
        onDelete: "CASCADE",
      },
      image: {
        type: Sequelize.STRING,
      },
      rate: {
        type: Sequelize.STRING,
      },
      is_deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("tbl_services");
  },
};
