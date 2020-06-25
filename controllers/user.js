const bcrypt = require('bcryptjs'); // 密码加密
const jwt = require('jsonwebtoken'); // 签发token给前端
const koajwt = require('koa-jwt')
const secret = require('../config/secret');
const userModel = require('../modules/user');
const result = require('../utils/result');

class UserController {
  static async register(ctx, next) {
    const user = ctx.request.body;

    const { name } = user
    if (name) {
      // 查询用户名是否重复
      const existUser = await userModel.findUser({name})
      if (existUser && existUser.length !== 0) {
        // 反馈存在用户名
        ctx.body = result(null, '用户已存在', false)
      } else {
        // 加密密码
        const salt = bcrypt.genSaltSync();  // 密码加密的计算强度默认10级
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
        
        // 创建用户
        await userModel.create(user);
        let newUser = await userModel.findUser({name})
  
        // 签发token
        const userToken = {
          name,
          id: newUser.id,
          role: newUser.role
        }
        
        // 储存token失效有效期1小时
        const token = jwt.sign(userToken, secret.sign, {expiresIn: '2d'});
        
        ctx.body = result({
          token,
          newUser
        },'创建用户成功')
      }
    } else {
      ctx.body = result( null, '创建失败，参数错误', false);
    }
  }
  
  static async list(ctx, next) {
    const query = ctx.request.body
    let list = await userModel.findAllUserList({
      ...query,
      role: 'user',
      isDeleted: false
    });
    return result({list},'查询成功')
  }
  
  static async adminList(ctx, next) {
    const query = ctx.request.body;
    const role = ctx.state.userInfo.role
    if (role === 'admin') {
      let list = await userModel.adminList(query);
      ctx.body = result({list}, '查询成功')
    } else {
      ctx.body = result(null,'无权限操作', false)
    }
    
  }
  
  /**
   * 登录
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async login(ctx, next) {
    const data = ctx.request.body;
    const {name, password} = data
    if (name && password) {
      // 查询用户是否存在
      const user = await userModel.findUser({name});
      if (user) {
        // 查询用户密码是否正确
        if (bcrypt.compareSync(password, user.password)) {
          const userToken = {
            name,
            id: user.id,
            role: user.role
          }
          // 签发token
          const token = jwt.sign(userToken, secret.sign, {expiresIn: '24h'});
  
          ctx.cookies.set(
            'netdisk-token',
            token,    //可替换为token
            {
              domain: 'localhost',  // 写cookie所在的域名
              path: '/',       // 写cookie所在的路径
              maxAge: 24 * 60 * 60 * 1000, // cookie有效时长
              httpOnly: false,  // 是否只用于http请求中获取
              overwrite: false  // 是否允许重写
            }
          )
          ctx.body = result({
            id: user.id,
            name: user.name,
            role: user.role,
            token: token
          }, '登录成功')
        } else {
          ctx.body = result(null, '用户名或密码错误', false);
        }
      } else {
        ctx.body = result(null, '用户不存在', false);
      }
    } else {
      ctx.body = result( null, '登录失败，参数错误', false);
    }
  }
  
  static async getUserInfo(ctx, next) {
    let userInfo = await userModel.getUserInfo({name: ctx.state.user.name})
    if (userInfo) {
      ctx.body = result(userInfo, '查询成功')
    } else {
      ctx.body = result(null, "用户信息不存在", false)
    }
  }
  
  
  static async delete(ctx, next) {
    const { name } = ctx.request.body;
    let user = await userModel.findUser(name);
    if (user) {
      user.isDeleted = 1
      const tag = await userModel.update(user);
      ctx.body = result({
        tag,
      }, '删除成功')
    } else {
      ctx.body = result(null, '删除失败，用户不存在', false)
    }
  }
  
  static async update(ctx) {
    const newUser = ctx.request.body;
    await userModel.update(newUser);
    return result(null, '更新成功')
  }
  
}

module.exports = UserController
