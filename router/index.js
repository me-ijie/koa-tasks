const { regist, login, info, delUser, update } = require('../controllers/user')
const { create, get, user, recall, urge } = require('../controllers/inquiry')

const router = require('koa-router')()
const routerPrefix = '/api'

// 访问后台接口根路径,返回欢迎词语
router.get('/', (ctx, next) => {
    ctx.body = 'welcome koa-tasks';
})

// 用户模块
router.post(`${routerPrefix}/user/regist`, regist)
router.post(`${routerPrefix}/user/login`, login)
router.get(`${routerPrefix}/user/info`, info)
router.post(`${routerPrefix}/user/del`, delUser)
router.post(`${routerPrefix}/user/update`, update)

// 询价模块
router.post(`${routerPrefix}/inquiry/create`, create)
router.get(`${routerPrefix}/inquiry/get`, get)
router.get(`${routerPrefix}/inquiry/user`, user)
router.post(`${routerPrefix}/inquiry/recall`, recall)
router.post(`${routerPrefix}/inquiry/urge`, urge)

// 所有未匹配的路由返回404状态
router.all('(.*)', (ctx, next) => {
    console.log(111, ctx.request)
    ctx.response.status = 404;
    return ctx.response.message = 'not match url.'
})

module.exports = router