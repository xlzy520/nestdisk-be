const router = require('koa-router')()
const Controller = require('../controllers/files')
const multer=require('koa-multer')
const storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, 'static/')
  },
  //修改文件名称
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
  },
  
  
  
})
//加载配置
const upload = multer({ storage: storage });

router.prefix('/file')

router.post('/upload', upload.single("file"), Controller.add);
router.post('/list', Controller.list);
router.post('/adminList', Controller.adminList);
router.post('/shareList', Controller.shareList);
router.post('/delete', Controller.delete);
router.post('/update', Controller.update);
router.post('/createShare', Controller.createShare);
router.post('/shareDetail', Controller.shareDetail);

module.exports = router;
