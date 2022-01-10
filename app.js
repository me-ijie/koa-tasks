const Koa          =     require('koa')
const bodyParser   =     require('koa-bodyparser') // 这个模块用于解析body的json格式等
const routerMap    =     require('./router')
const app          =     new Koa()
const config       =     require('./config')        // 配置文件
const mysql        =     require('./lib/mysql')     // 自己写的简单封装mysql使用
const cors         =     require('koa-cors')
const errHandle    =     require('./lib/errorHandle')
// const koajwt       =     require('koa-jwt')
// const SECRET       =     'todotasks'

app.use(mysql(config.mysql))   
app.use(cors({
   origin: 'http://localhost:8080',
   credentials: true
}))                    // app.use((ctx, next) => {}) 有名的koa的middleware模式(洋葱模式), 可以上官网查看一下这个方法和资料
app.use(bodyParser())
app.use(errHandle())
// app.use(koajwt({ secret: SECRET }).unless({
//    // 登录接口不需要验证
//    path: [/^\/api\/user\/login/]
// }));
// 路由配置
app.use(routerMap.routes())
// 使用路由
app.use(routerMap.allowedMethods())


app.listen(config.port, () => {
   console.log(`🚀 Server ready at http://localhost:${config.port}`)
})
