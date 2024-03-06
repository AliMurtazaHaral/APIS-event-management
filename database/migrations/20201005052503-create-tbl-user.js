"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tbl_users", {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      full_name: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      password_token: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      country_code: {
        type: Sequelize.STRING,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      profile_image: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.ENUM,
        values: ["provider", "customer"],
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      approval_status: {
        type: Sequelize.ENUM,
        values: ["pending", "approved", "rejected"],
        defaultValue: "pending",
      },
      expiration_date: { type: Sequelize.STRING, allowNull: true },
      price: { type: Sequelize.STRING, allowNull: true },
      is_service_created: Sequelize.BOOLEAN,
      month: Sequelize.STRING,
      is_plan_purchased: Sequelize.BOOLEAN,
      verification_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_verification_done: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_notification_done: { type: Sequelize.BOOLEAN, defaultValue: true },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("tbl_users");
  },
};
