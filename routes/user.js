
const router = require('koa-router')()
const UserController = require('../controllers/user')

router.prefix('/user')

/**
 * 用户接口
 */

// 用户注册
router.post('/register', UserController.register);
// 用户登录
router.post('/login', UserController.login);
// // 删除用户
router.delete('/delete/:id', UserController.delete);
// // 获取用户信息
router.get('/info', UserController.getUserInfo);
// 获取用户列表
router.post('/list', UserController.list);
router.post('/delete', UserController.delete);
router.post('/update', UserController.update);

module.exports = router
