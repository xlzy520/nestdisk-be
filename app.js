const Koa = require('koa')
const app = new Koa()  // 第一步:创建实例
const cors = require('koa-cors');
const views = require('koa-views')
const json = require('koa-json')
const jwt = require('jsonwebtoken')
const koajwt = require('koa-jwt')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')


const user = require('./routes/user')
const files = require('./routes/files')

const SECRET = 'secret'; // demo，可更换


// error handler
onerror(app)

app.use(cors());

// middlewares 第二步:app.use()传入中间件
app.use(bodyparser({
  enableTypes:['json', 'form', 'text'],
  
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

logger
app.use(async (ctx, next) => {
  await next().catch(err=>{
    if (err.message === 'jwt expired') {
      ctx.body = {
        code: 401,
        msg: '登录过期，请重新登录',
        success: false
      }
    } else {
      throw err;
    }
  })
})

app.use(async(ctx, next)=> {
  const token = ctx.cookies.get('netdisk-token');
  if(!token){
    await next();
  }else{
    const userInfo = jwt.verify(token, SECRET)
    ctx.state = {
      userInfo
    };
    await next();
  }
})



// 中间件对token进行验证
app.use(async (ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 200;
      ctx.body = {
        code: 401,
        msg: '登录过期或已失效，请重新登录',
        success: false
      }
    } else {
      throw err;
    }
  })
});

app.use(koajwt({ secret: SECRET, cookie: 'netdisk-token'}).unless({
  // 登录，注册接口不需要验证
  path: [/^\/user\/login/, /^\/user\/register/, /^\/file\/upload/]
}));

// routes
app.use(user.routes(), user.allowedMethods())
app.use(files.routes(), files.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app


