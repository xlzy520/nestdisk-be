const router = require('koa-router')()
const NovelController = require('../controllers/novel')

// 路由前缀，比如前端请求下面接口时，会请求 /novel/detail    或者/novel/section_data
router.prefix('/novel')


router.get('/detail', NovelController.getDetail);
router.get('/section_data', NovelController.getSectionData);

module.exports = router;
