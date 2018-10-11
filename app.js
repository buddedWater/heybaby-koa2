const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const jwtKoa = require('koa-jwt')
const secret = 'dear baby'
const index = require('./routes/index')
const articles = require('./routes/articles')
const oranges = require('./routes/oranges')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(jwtKoa({secret}).unless({
  path: [/^\/api1/] //数组中的路径不需要通过jwt验证
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(articles.routes(), articles.allowedMethods())
app.use(oranges.routes(), oranges.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
