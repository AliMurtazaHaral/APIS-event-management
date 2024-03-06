"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tbl_notifications", {
      notification_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sender_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_users", key: "user_id" },
      },
      receiver_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_users", key: "user_id" },
      },
      message: {
        type: Sequelize.TEXT,
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      notification_type: {
        type: Sequelize.INTEGER,
      },
      event_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_events", key: "event_id" },
      },
      event_ticket_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_event_tickets", key: "event_ticket_id" },
      },
      service_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_services", key: "service_id" },
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
    await queryInterface.dropTable("tbl_notifications");
  },
};
