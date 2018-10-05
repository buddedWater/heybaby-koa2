const router = require('koa-router')()
const secret = 'dear baby'
const jwt = require('jsonwebtoken')
const db = require('monk')('mongodb://admin:heyheyyou@60.205.231.78:27017/admin')
const users = db.get('users')
const { encrypt, validate } = require('../utils/bcryptPassword')

router.get('/api1', async (ctx, next) => {
  let { pwd } = ctx.request.query
  let password = await encrypt(pwd)
  console.log(password)
  let flag = await validate(pwd,password)
  ctx.body = {
    password,flag
  }
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
  let st = await users.findOne({name:user.name});
  if(st){
    let flag = await validate(user.password,st.password)
    if(flag) {
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
  }else {
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
