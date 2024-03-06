'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbl_event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      tbl_event.hasMany(models.tbl_event_ticket, {
        foreignKey: "event_id",
        as: "tickets",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      tbl_event.belongsTo(models.tbl_category, {
        foreignKey: "category_id",
        as: "category",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      tbl_event.hasMany(models.tbl_event_media, {
        foreignKey: "event_id",
        as: "media",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      tbl_event.belongsTo(models.tbl_user, {
        foreignKey: "user_id",
        as: "user",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      tbl_event.hasMany(models.tbl_service_booking, {
        foreignKey: "event_id",
        as: "service_booked",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
    }
  };
  tbl_event.init({
    event_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    address: DataTypes.TEXT,
    category_id: DataTypes.INTEGER,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME,
    about: DataTypes.TEXT,
    is_deleted: DataTypes.BOOLEAN,
    is_stop_selling: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'tbl_event',
  });
  return tbl_event;
};