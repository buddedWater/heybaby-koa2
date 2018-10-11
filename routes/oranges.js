const router = require('koa-router')()
const db = require('monk')('mongodb://admin:heyheyyou@60.205.231.78:27017/admin')
const oranges = db.get('oranges')
oranges.createIndex({'modifyTime': -1})

router.get('/api1/orange', async (ctx) => {
  let { num } = ctx.request.query
  let total = await oranges.count()
  let st = await oranges.find({},{ sort: {'modifyTime': -1}, limit: parseInt(num) })
  ctx.body = { code: 1, list: st, total };
})

router.post('/api2/orange', async (ctx) => {
  let st = await oranges.insert(ctx.request.body);
  if(st){
    ctx.body = { code: 1 };
  }else{
    ctx.body = { code: -1 };
  }   
})

router.put('/api2/orange', async (ctx) => {
  console.log(ctx.request.body)
  let st = await oranges.findOneAndUpdate(ctx.request.body._id,{"$set": ctx.request.body});
  console.log(st)
  if(st){
    ctx.body = { code: 1 };
  }else{
    ctx.body = { code: -1 };
  }   
})

router.delete('/api2/orange', async (ctx) => {
  console.log(ctx.request.body)
  let st = await oranges.findOneAndDelete(ctx.request.body._id);
  console.log(st)
  if(st){
    ctx.body = { code: 1 };
  }else{
    ctx.body = { code: -1 };
  }   
})

module.exports = router