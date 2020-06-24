const fileModel = require('../modules/files');
const result = require('../utils/result');
const crypto = require('crypto')
const fs = require('fs')

let readFileMd5 = (url) =>{
  return new Promise((reslove) => {
    let md5sum = crypto.createHash('md5');
    let stream = fs.createReadStream(url);
    stream.on('data', function(chunk) {
      md5sum.update(chunk);
    });
    stream.on('end', function() {
      let fileMd5 = md5sum.digest('hex');
      reslove(fileMd5);
    })
  })
}

class FilesController {
  static async add(ctx){
    const fileData = ctx.req.file
    const hash = await readFileMd5(fileData.path)
    if (fileData) {
      fileData.hash = hash
      fileData.name = fileData.originalname
      fileData.userId = ctx.state.userInfo.id
      const newData = await fileModel.add(fileData)
      ctx.body = result(newData)
    } else {
      ctx.body = result(null, '参数错误', false)
    }
  }
  static async delete(ctx, next) {
    const { id } = ctx.request.body;
    let one = await fileModel.findOne({id});
    if (one) {
      one.isDeleted = 1
      const newOne = await fileModel.update(one);
      ctx.body = result({
        newOne,
      }, '删除成功')
    } else {
      ctx.body = result(null, '删除失败，操作对象不存在', false)
    }
  }
  
  static async update(ctx) {
    const newData = ctx.request.body;
    await fileModel.update(newData);
    ctx.body = result(null, '更新成功')
  }
  
  static async createShare(ctx) {
    const newData = ctx.request.body;
    newData.userId = ctx.state.userInfo.id
    newData.shareKey = Math.random().toString(36).substr(2).slice(1,5)
    await fileModel.update(newData);
    ctx.body = result(newData, '更新成功')
  }
  
  static async list(ctx, next) {
    const query = ctx.request.body
    let list = await fileModel.findList({
      ...query,
      isDeleted: false
    });
    ctx.body = result({list},'查询成功')
  }
}

module.exports = FilesController
