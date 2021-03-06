const Koa = require('koa');
const app = new Koa();
const path = require('path')
const server = require('http').Server(app.callback())
const shortId = require('shortid')
const cors = require('koa-cors');

const router = require('koa-router')();
const koaBody = require('koa-body');
const static = require('koa-static')

const Low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json')
const db = Low(adapter)
db.defaults({groups:[],users:[],projs:[],userInfo:[]}).write();

const staticPath = './static'
app.use(cors());


app.use(static(path.join(__dirname,staticPath)))

const main = ctx =>{
    ctx.response.body = 'hello wo1rld'
}
const saveInfo = ctx => {
    let arr = ctx.request.body;
    console.log(ctx)
    for(index in arr){
        db.get('userInfo').push(arr[index]).write();
    }
    ctx.response.body = ctx.response;
}
router.post('/save', koaBody(),
  (ctx) => {
    console.log(ctx.request.body);
    let arr = ctx.request.body;
    db.get('userInfo').push({id:shortId.generate(),data:arr}).write();
    ctx.body = JSON.stringify(db.get('userInfo').value());
  }
);
router.get('/getinfos', koaBody(),
  (ctx) => {
      ctx.status=200;
    ctx.body = JSON.stringify(db.get('userInfo').value());
  }
);
router.get('/getsome',koaBody(),(ctx)=>{
  // console.log(ctx);
  ctx.static = 200;
  let data = [
    {
        index:0,
        title:"标题",
        view:1299
    },
    {
        index:1,
        title:"标题1",
        view:99  
    }
];
  ctx.body = JSON.stringify(data) ;
})
router.get("/gethonerdata",koaBody(),(ctx)=>{
  ctx.static = 200;
  let data = {
    xiahong:{
      heros:20,
      skins:40,
      victory:60,
      faild:100
    },
   xiaoming:{
      heros:30,
      skins:20,
      victory:60,
      faild:80
    }
  }
  ctx.body = JSON.stringify(data) ;
})
 
app.use(router.routes());
server.listen(3000, () => {
    console.log('Application is starting on port 3000')
})
