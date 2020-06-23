// 初始化小说详情数据库表结构
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('detail', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    novel_img: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    novel_author: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    novel_condition: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    novel_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    novel_new: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    novel_profile: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  }, {
    freezeTableName: true
  })
}
