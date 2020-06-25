const sequelize= require('../config/db');
const User = sequelize.import('../schema/user');
const Files = sequelize.import('../schema/files');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// 通过 sync 方法同步数据结构
// 即,创建表
User.sync({force: false})
User.hasMany(Files)


class UserModel{
  static async findUser(query, attributes){
    return await User.findOne({
      where: query,
      attributes: attributes,
    })
  }
  
  static async getUserInfo(query){
    return await User.findOne({
      attributes: { exclude: ['password'] },
      where: query,
    })
  }
  
  static async create(userInfo){
    return await User.create(userInfo)
  }
  
  static async resetPassword(userInfo, newPassword){
    const { phone } = userInfo
    return await User.update({
      password: newPassword
    }, {
      where: {
        phone
      }
    })
  }
  
  static async update(data){
    const id = data.id
    return await User.update(data,{
      where:{
        id
      }
    })
  }
  
  static async findAllUserList(query){
    return await User.findAll({
      where: {
        ...query,
        name: {
          [Op.like]:'%' +query.name + '%'
        },
        phone: {
          [Op.like]:'%' +query.phone + '%'
        },
      },
      
      // attributes: ['id', 'username'],
    })
  }
  
  static async adminList(conditions){
    let { name='', pageNo = 1, start, end, pageSize = 100, ...rest } = conditions
    let offset = (pageNo - 1) * pageSize;
    return await User.findAndCountAll({
      attributes: {
        exclude: ['password'],
      },
      where: {
        name: {
          [Op.like]:'%' +name + '%'
        },
        isDeleted: 0,
        ...rest
      },
      offset,
      limit: pageSize,
      include: [{
        model: Files,
        attributes: ['name'],
        raw: false
      }]
    })
  }
}
module.exports =  UserModel
