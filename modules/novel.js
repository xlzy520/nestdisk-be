const sequelize= require('../config/db');
const Detail = sequelize.import('../schema/detail');
const SectionData = sequelize.import('../schema/section_data');
// 通过 sync 方法同步数据结构
// 即,创建表
Detail.sync({force: false})
SectionData.sync({force: false})


class NovelModel{
  
  static async getDetail(condition){
    return await Detail.findAll({
      where:{
        ...condition
      },
    })
  }
  
  static async getSectionData(conditions){
    return await SectionData.findAll({
      where: {
        ...conditions
      },
    })
  }
  
  
}
module.exports =  NovelModel
