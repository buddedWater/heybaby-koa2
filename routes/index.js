const router = require('koa-router')()
const secret = 'dear baby'
const jwt = require('jsonwebtoken')
const db = require('monk')('mongodb://admin:admin@60.205.231.78:27017/admin')
const users = db.get('users')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/baby/userInfo', async (ctx) => {
  const token = ctx.header.authorization  // 获取jwt
  let payload
  if (token) {
      payload = await verify(token.split(' ')[1], secret)  // // 解密，获取payload
      ctx.body = {
          payload
      }
  } else {
      ctx.body = {
          message: 'token 错误',
          code: -1
      }
  }
})

router.post('/api1/login', async (ctx, next) => { 
  const user = ctx.request.body
  let st = await users.findOne(user);
  console.log(user,st)
  if(st) {
    let userToken = {
        name: user.name
    }
    const token = jwt.sign(userToken, secret, {expiresIn: '1h'})  //token签名 有效期为1小时
    ctx.body = {
        code: 1,
        token
    }
  } else {
    ctx.body = {
        message: '参数错误',
        code: -1
    }
  } 
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
