const sequelize= require('../config/db');
const Files = sequelize.import('../schema/files');
const Op = sequelize.Op;
// 通过 sync 方法同步数据结构
// 即,创建表
Files.sync({force: false})


class FilesModel{
  static async findOne(query, attributes){
    return await Files.findOne({
      where: query,
      attributes: attributes,
    })
  }
  
  static async add(data){
    return await Files.create(data)
  }
  
  static async update(data){
    return await Files.update(data,{
      where:{
        id: data.id
      }
    })
  }
  
  static async findList(query){
    let { name='', pageNo = 1, start, end, pageSize = 10, ...rest } = query
    let offset = (pageNo - 1) * pageSize;
    return await Files.findAndCountAll({
      attributes: {
        // exclude: [],
      },
      where: {
        name: {
          [Op.like]:'%' +name + '%'
        },
        isDeleted: false,
        ...rest
      },
      offset,
      limit: pageSize
    })
  }
  
}
module.exports =  FilesModel
