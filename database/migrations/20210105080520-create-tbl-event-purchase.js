'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_event_purchases', {
      purchase_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.STRING
      },
      total_amount: {
        type: Sequelize.FLOAT
      },
      provider_amount: {
        type: Sequelize.FLOAT
      },
      stripe_customer_id: {
        type: Sequelize.STRING
      },
      card_id: {
        type: Sequelize.STRING
      },
      provider_account_id: {
        type: Sequelize.STRING
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_users", key: "user_id" },
      },
      provider_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_users", key: "user_id" },
      },
      event_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_events", key: "event_id" },
      },
      event_ticket_id: {
        type: Sequelize.INTEGER,
        references: { model: "tbl_event_tickets", key: "event_ticket_id" },
      },
      ticket: {
        type: Sequelize.INTEGER
      },
      transaction_id: {
        type: Sequelize.STRING
      },
      transfer_id: {
        type: Sequelize.STRING
      },
      receipt: {
        type: Sequelize.STRING
      },
      payment_status: {
        type: Sequelize.STRING
      },
      commission: {
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('tbl_event_purchases');
  }
};