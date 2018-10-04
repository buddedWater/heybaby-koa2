const router = require('koa-router')()
const db = require('monk')('mongodb://admin:heyheyyou@60.205.231.78:27017/admin')
const articles = db.get('articles')
articles.createIndex({'createTime': -1})
articles.createIndex({'createTime': 1})
articles.createIndex({'modifyTime': -1})
articles.createIndex({'modifyTime': 1})


router.get('/api1/article', async (ctx) => {
  let { pageSize, current, orderBy, order } = ctx.request.query
  if(!orderBy){orderBy="createTime";order=-1}
  let total = await articles.count()
  console.log(total ,pageSize ,current)
  let st = await articles.find({},{sort: {[orderBy]: parseInt(order)}, skip: (current - 1)*pageSize, limit: parseInt(pageSize) })
  ctx.body = { code: 1, list: st, total };
})

router.post('/api2/article', async (ctx) => {
  let st = await articles.insert(ctx.request.body);
  if(st){
    ctx.body = { code: 1 };
  }else{
    ctx.body = { code: -1 };
  }   
})

router.put('/api2/article', async (ctx) => {
  console.log(ctx.request.body)
  let st = await articles.findOneAndUpdate(ctx.request.body._id,{"$set": ctx.request.body});
  console.log(st)
  if(st){
    ctx.body = { code: 1 };
  }else{
    ctx.body = { code: -1 };
  }   
})

router.delete('/api2/article', async (ctx) => {
  console.log(ctx.request.body)
  let st = await articles.findOneAndDelete(ctx.request.body._id);
  console.log(st)
  if(st){
    ctx.body = { code: 1 };
  }else{
    ctx.body = { code: -1 };
  }   
})

module.exports = router