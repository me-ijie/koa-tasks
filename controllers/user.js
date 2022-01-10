const { json }     = require('body-parser');
const utils        = require ('../lib/utils');
const jsonwebtoken = require('jsonwebtoken');
const SECRET       = 'todotasks';

// TODO 了解session, cookies 和jwt. session和cookies是不分家的, 一般session是存在服务端的信息, cookies是存在客户端的信息. jwt也会和他们搭配使用用于单点登录和csrf防护

const regist = async (ctx, next) => {
  let { name, mobile, pwd } = ctx.request.body;
  //md5散列
  pwd = utils.md5(pwd);
  try {
    // TODO 新加手机号字段
    // TODO 手机号，名称要唯一，不唯一抛错 
    let code = 0
    let message = ''
    let data = []
    let [rows, fields] = await ctx.db.query(`SELECT name FROM users WHERE name = ? LIMIT 1`, [name])
    if (rows.length && rows[0].name) {
      code = 40001
      message = '注册失败，昵称已存在'
      return ctx.Back({ code, message });
    }
    [rows, fields] = await ctx.db.query(`SELECT mobile FROM users WHERE mobile = ? LIMIT 1`, [mobile])
    if (rows.length && rows[0].mobile) {
      code = 40001
      message = '该手机号已被注册'
      return ctx.Back({ code, message });
    }
    [rows, fields] = await ctx.db.execute('INSERT INTO users (name, pwd, mobile) VALUES(?,?,?)', [name, pwd, mobile])
    if (rows && rows.insertId) return ctx.Back({ code, message }, rows.insertId);
  } catch (error) {
    ctx.Throw(403, error.message);
    ctx.Back(error.message, ctx.ErrCode.DATABASE_ERROR);
  }
}

const login = async (ctx, next) => {
  try {
    let { mobile, pwd } = ctx.request.body;
    pwd = utils.md5(pwd);
    // 手机号登录
    const [rows, fields] = await ctx.db.query(`SELECT * FROM users WHERE mobile = ? AND pwd = ? LIMIT 1`, [mobile, pwd])
    if (!rows.length) {
        ctx.response.status = 200;
        return ctx.body = {
          code: 400001,
          msg: '用户名或密码不正确'
        }
    }
    // 设置 cookies
    const token = jsonwebtoken.sign(
      { name: rows[0].name, id: rows[0].id },
      SECRET,
      { expiresIn: '1d' }
    )
    ctx.cookies.set('user', token)
    return ctx.Back({ code: 0, message: '' }, rows[0].id);
  } catch (error) {
    ctx.Throw(403, error.message);
    ctx.Back(error.message, ctx.ErrCode.DATABASE_ERROR);
  }
}

const info = async (ctx, next) => {
  try {
    const token = ctx.cookies.get('user')
    const user = jsonwebtoken.verify(token, SECRET)
    if (!user || !user.id) return ctx.body = ctx.errCode['PARAMS_ERROR']
    const [rows, fields] = await ctx.db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [user.id])
    if (!rows.length) {
      ctx.response.status = 200;
      return ctx.body = {
        code: 400001,
        msg: '获取用户信息失败'
      }
    }
    return ctx.Back({ code: 0, message: '' }, { name: rows[0].name, mobile: rows[0].mobile });
  } catch (error) {
    ctx.Throw(403, error.message);
    ctx.Back(error.message, ctx.ErrCode.DATABASE_ERROR);
  }
}

  // TODO 根据用户id修改用户信息
  const update = async (ctx, next) => {
    try {
      let { name, mobile, pwd, id } = ctx.request.body;
      pwd = utils.md5(pwd);
      const [rows, fields] = await ctx.db.query('UPDATE Users SET (name, mobile, pwd) WHERE id = ?', [name, mobile, pwd, id])
      console.log({rows})
      return ctx.body = {
        code: 200,
        data: 'success'
      }
    } catch (error) {
      ctx.status = 400;
      return ctx.response.message = error.message;
    }
  }

  // TODO 删除用户
  const delUser = async (ctx, next) => {
    try {
      let { id } = ctx.request.body;
      const [rows, fields] = await ctx.db.query('DELETE FROM Users WHERE id = ?', [id])
      return ctx.body = {
        code: 200,
        data: 'success'
      }
    } catch (error) {
      ctx.status = 400;
      return ctx.response.message = error.message;
    }
  }

module.exports = {
  regist,
  login,
  info,
  update,
  delUser
}
