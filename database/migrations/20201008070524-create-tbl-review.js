"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tbl_reviews", {
      review_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      provider_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_users", key: "user_id" },
        onDelete: "CASCADE",
      },
      given_by_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_users", key: "user_id" },
        onDelete: "CASCADE",
      },
      review: {
        type: Sequelize.TEXT,
      },
      rating: {
        type: Sequelize.INTEGER,
      },
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
    await queryInterface.dropTable("tbl_reviews");
  },
};
