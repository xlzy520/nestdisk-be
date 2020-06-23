// 初始化章节数据数据库表结构
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('section_data', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // 章节号
    index: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    // 所属小说的ID
    book_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    // 章节标题
    section_text: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    // 章节链接地址
    section_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
  }, {
    freezeTableName: true
  })
}
