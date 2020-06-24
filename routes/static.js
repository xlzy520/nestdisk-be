const router = require('koa-router')()
const send = require('koa-send');

router.prefix('/static')

router.get('/:name',  async (ctx) => {
  const name = ctx.params.name;
  const path = `static/${name}`;
  ctx.attachment(path);
  await send(ctx, path);
});

module.exports = router
