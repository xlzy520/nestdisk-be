const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('files', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    size: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    hash: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    shareKey: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    shareStatus: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    shareType: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    shareUrl: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    isDeleted: {
      type: DataTypes.TINYINT(0),
      allowNull: true,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD hh:mm:ss');
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD hh:mm:ss');
      }
    }
  }, {
    freezeTableName: true
  })
}
