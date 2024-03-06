'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_service_booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_service_booking.belongsTo(models.tbl_user, {
        foreignKey: "customer_id",
        source_id:"user_id",
        as: "customer",
        onDelete: "CASCADE",
      });
      tbl_service_booking.belongsTo(models.tbl_user, {
        foreignKey: "provider_id",
        source_id:"user_id",
        as: "provider",
        onDelete: "CASCADE",
      });
      tbl_service_booking.belongsTo(models.tbl_event, {
        foreignKey: "event_id",
        as: "event",
        onDelete: "CASCADE",
      });
      tbl_service_booking.belongsTo(models.tbl_service, {
        foreignKey: "service_id",
        as: "service",
        onDelete: "CASCADE",
      });
    }
  };
  tbl_service_booking.init({
    booking_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    order_id: DataTypes.STRING,
    total_amount: DataTypes.FLOAT,
    provider_amount: DataTypes.FLOAT,
    stripe_customer_id: DataTypes.STRING,
    card_id: DataTypes.STRING,
    provider_account_id: DataTypes.STRING,
    customer_id: DataTypes.INTEGER,
    provider_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME,
    hours: DataTypes.STRING,
    rate: DataTypes.FLOAT,
    commission: DataTypes.FLOAT,
    payment_status:DataTypes.STRING,
    transaction_id:DataTypes.STRING,
    transfer_id:DataTypes.STRING,
    event_id:DataTypes.INTEGER,
    receipt: DataTypes.STRING,
    bill_image: DataTypes.STRING,
    request_status:{type:DataTypes.ENUM,values:["pending","accepted","rejected"]},
    service_status:{type:DataTypes.ENUM,values:["pending","started","completed"]}

  }, {
    sequelize,
    modelName: 'tbl_service_booking',
  });
  return tbl_service_booking;
};