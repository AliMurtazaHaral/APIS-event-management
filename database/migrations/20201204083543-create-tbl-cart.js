'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_carts', {
      cart_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_users", key: "user_id" },
        onDelete: "CASCADE",
      },
      event_ticket_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_event_tickets", key: "event_ticket_id" },
        onDelete: "CASCADE",
      },
      service_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_services", key: "service_id" },
        onDelete: "CASCADE",
      },
      event_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_events", key: "event_id" },
        onDelete: "CASCADE",
      },
      type: {
        type: Sequelize.ENUM,
        values:["service","event"]
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      total: {
        type: Sequelize.FLOAT
      },
      start_date: {
        type: Sequelize.DATE
      },
      start_time: {
        type: Sequelize.TIME
      },
      end_time: {
        type: Sequelize.TIME
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tbl_carts');
  }
};