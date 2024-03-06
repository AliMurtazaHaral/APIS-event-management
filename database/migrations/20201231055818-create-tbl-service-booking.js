"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tbl_service_bookings", {
      booking_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_id: {
        type: Sequelize.STRING,
      },
      total_amount: {
        type: Sequelize.FLOAT,
      },
      provider_amount: {
        type: Sequelize.FLOAT,
      },
      stripe_customer_id: {
        type: Sequelize.STRING,
      },
      card_id: {
        type: Sequelize.STRING,
      },
      provider_account_id: {
        type: Sequelize.STRING,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_users", key: "user_id" },
      },
      provider_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_users", key: "user_id" },
      },
      service_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_services", key: "service_id" },
      },
      event_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_events", key: "event_id" },
      },
      transaction_id: { type: Sequelize.STRING },
      transfer_id: { type: Sequelize.STRING },
      payment_status: {
        type: Sequelize.STRING,
      },
      receipt: {
        type: Sequelize.STRING,
      },
      bill_image: {
        type: Sequelize.STRING,
      },
      request_status: {
        type: Sequelize.ENUM,
        values: ["pending", "accepted", "rejected"],
        defaultValue: "pending",
      },
      service_status: {
        type: Sequelize.ENUM,
        values: ["pending", "started", "completed"],
        defaultValue: "pending",
      },
      date: {
        type: Sequelize.DATEONLY,
      },
      start_time: {
        type: Sequelize.TIME,
      },
      end_time: {
        type: Sequelize.TIME,
      },
      hours: {
        type: Sequelize.STRING,
      },
      rate: {
        type: Sequelize.FLOAT,
      },
      commission: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable("tbl_service_bookings");
  },
};
