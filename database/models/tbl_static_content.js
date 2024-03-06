'use strict';
module.exports = (sequelize, DataTypes) => {
  const tbl_static_content = sequelize.define('tbl_static_content', {
    static_content_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.TEXT
    },
    content: DataTypes.TEXT,
    type: DataTypes.ENUM('web', 'app'),
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {});
  tbl_static_content.associate = function (models) {
    // associations can be defined here
  };
  return tbl_static_content;
};