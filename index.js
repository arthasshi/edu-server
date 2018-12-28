const Koa = require('koa');
const app = new Koa();
const server = require('http').Server(app.callback())
const io = require('socket.io')(server)
const shortId = require('shortid')

const router = require('koa-router')();
const koaBody = require('koa-body');

const Low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json')
const db = Low(adapter)
db.defaults({groups:[],users:[],projs:[],userInfo:[]}).write();
// io.on('connect',function(socket){
//     socket.emit('callback',{data:{},msg:'链接服务器：成功'});
//     /*
//         管理员页面和用户页面都要最先发送这个事件，用以确认登录和回传相关数据 
//      */
//     socket.on('login',function(data){
//         /* 目前只有管理员和普通用户 */
//         if(data=='admin'){
//             callBack(socket,{},'服务器已经分辨出你是谁:'+data)
//             postGroups(socket)
//         }else{
//             postMates(socket);
//             callBack(socket,{},'服务器验证信息:更新')
//         }
//     })
//     /*
//          用户页面发送的事件，用来告诉服务端，这个socket属于谁，
//          确认成功会，会把这个用户所在的组的周报信息发送过去
//      */
//     socket.on('ensureUser',function(data){
//         callBack(socket,{},'身份确认成功：'+data.name)
//         let group = db.get('groups').find({id:data.groupId}).value();//获得组信息
//         let groupMate = db.get('users').filter({groupId:data.groupId}).value();//获得组员
//         console.log(data);
//         socket.emit('ensureCallBack',{group:group,mates:groupMate})
//         /* 
//             获取已有周报信息
//          */
//         let broadCastData ={
//             groupId:data.groupId,
//             isFirst:true,
//             data:db.get('projs').filter({weekIndex:data.weekIndex,groupId:data.groupId}).value()
//         }
//         broadBack(broadCastData,data.name+'上线啦！！！')
//     })
//     /* 
//         管理端发送的新增群组或者组员事件，保存成功后回传
//      */
//     socket.on('saveMate',function(data){
//         console.log(data);
//         callBack(socket,{},'数据已收到')
//         if(data.type == 'group'){
//             db.get('groups').push({id:shortId.generate(),name:data.name,mems:[]}).write();
//             postGroups(socket)
//             callBack(socket,{},'更新数据已回传')
//         }else{
//             db.get('users').push({id:shortId.generate(),name:data.name,phone:data.phone,groupId:data.groupId}).write();
//             postGroups(socket)
//             callBack(socket,{},'更新数据已回传')
            
//         }
//     })
//     /* 
//         用户页面发送的保存周报信息事件，
//      */
//     socket.on('saveProj',function(data){
//         // callBack(socket,111,'数据已动态存储');
//         if(db.get('projs').filter({weekIndex:data.weekIndex,name:data.name}).value().length>0){//如果已经存在对应的星期和用户数据，就是更新这条数据
//             db.get('projs').find({weekIndex:data.weekIndex,name:data.name}).assign({groupName:data.groupName,plan:data.plan,summ:data.summ,other:data.other}).write();
//         }else{//不存在对应数据，就插入新数据
//             db.get('projs').push(data).write();
//         }
//         /* 
//             通知前端更新
//          */
//         let broadCastData ={
//             groupId:data.groupId,
//             data:db.get('projs').filter({weekIndex:data.weekIndex,groupId:data.groupId}).value()
//         }
//         broadBack(broadCastData,'数据同步成功');
//         // socket.emit('callback','数据已动态存储')
//     })
// })


// /* 
//     通用的回调消息，给socket发送消息
//  */
// function callBack(soc,data,msg){
//     let msgStr = (new Date()).toLocaleString()+":"+msg
//     let reData = {
//         data:data,
//         msg:msgStr
//     }
//     soc.emit('callback',reData);
// }
// /* 
//     给socket发送群组数据，并且每个组都携带着组员信息
//  */
// function postGroups(socket){
//     let mems = db.get('groups').value()
//     for(let item of mems){
//         let mems = db.get('users').filter({groupId:item.id}).value()
//         item.mems = mems;
//     }
//     socket.emit('memberEvent',mems)
// }
// /*
//     给指定的socket连接发送users数据
//  */
// function postMates(socket){
//     let mems = db.get('users').value()
//     socket.emit('memberEvent',mems)
// }
// //需要给所有链接的用户发送的消息
// /* 
//     目前已知的，数据保存，新用户进入
//  */
// function broadBack(data,msg){
//     let msgStr = (new Date()).toLocaleString()+":"+msg
//     io.emit('broadcast',{data:data,msg:msgStr})
// }


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
 
app.use(router.routes());
// app.use(router.get('/',main))
// app.use(router.post('/save',koaBody(),
// (ctx) => {
//   console.log(ctx.request.body);
//   // => POST body
//   ctx.body = JSON.stringify(ctx.request.body);
// }));

// console.log(router)
// const saveProj = ctx =>{
//     db.set('web',[]).write();
//     console.log(ctx.request.body)
//     let arr = ctx.request.body;
//     for(index in arr){
//         db.get('web').push(arr[index]).write();
//     }

//     ctx.response.body = {status:"200",msg:"success"};

// }
// const readProj = ctx =>{
//     let projs = db.get('web').value();
//     ctx.response.body = projs;
// }
// const saveResult = ctx =>{
//     let arr = ctx.request.body;
//     for(index in arr){
//         db.get('webRes').push(arr[index]).write();
//     }
//     ctx.response.body = {status:"200",msg:"success"};
// }
// const readResult = ctx =>{
//     let query = ctx.query;
//     console.log(query);
//     let weeksub = db.get(query.group).value();
//     ctx.response.body = weeksub;
// }
// app.on('error',(err,ctx)=>{
//     let projs = db.get('webRes').value();
//     console.error('server error',err);
// })

// app.use(route.get('/',main));
// app.use(route.post('/saveInfo',saveInfo));
// app.use(route.get('/readProj',readProj));
// app.use(route.post('/saveResult',saveResult));
// app.use(route.get('/readResult',readResult));

// app.listen(3000);
server.listen(3000, () => {
    console.log('Application is starting on port 3000')
})
