'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_admin = sequelize.define('tbl_admin', {
    admin_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    profile_photo: DataTypes.STRING,
    otp: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
    is_deleted: DataTypes.BOOLEAN
  }, {});
  tbl_admin.associate = function (models) {
    // associations can be defined here
  };
  return tbl_admin;
};