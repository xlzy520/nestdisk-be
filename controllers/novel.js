const util = require('util')
const NovelModel = require('../modules/novel');
const result = require('../utils/result');
const sequelize= require('../config/db');
const Op = sequelize.Op

class NovelController{
  
  static async getDetail(ctx){
    const query = ctx.request.query;
    console.log(query.id);
    const list = await NovelModel.getDetail(query);
    ctx.body = result({
      list
    }, '查询成功')
  }
  
  static async getSectionData(ctx){
    const query = ctx.request.query;
    const list = await NovelModel.getSectionData({
      book_id: query.id,
    });
    ctx.body = result({
      list
    }, '查询成功')
  }

}

module.exports = NovelController
