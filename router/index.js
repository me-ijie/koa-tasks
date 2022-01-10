const { regist, login, info, delUser, update } = require('../controllers/user')

const router = require('koa-router')()
const routerPrefix = '/api/user'

// 访问后台接口根路径,返回欢迎词语
router.get('/', (ctx, next) => {
    ctx.body = 'welcome koa-tasks';
})

// 用户模块
router.post(`${routerPrefix}/regist`, regist)
router.post(`${routerPrefix}/login`, login)
router.get(`${routerPrefix}/info`, info)
router.post(`${routerPrefix}/del`, delUser)
router.post(`${routerPrefix}/update`, update)

// 所有未匹配的路由返回404状态
router.all('(.*)', (ctx, next) => {
    console.log(111, ctx.request)
    ctx.response.status = 404;
    return ctx.response.message = 'not match url.'
})

module.exports = router
