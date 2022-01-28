const { json }     = require('body-parser');
const jsonwebtoken = require('jsonwebtoken');
const SECRET       = 'todotasks';

// TODO 了解session, cookies 和jwt. session和cookies是不分家的, 一般session是存在服务端的信息, cookies是存在客户端的信息. jwt也会和他们搭配使用用于单点登录和csrf防护

const create = async (ctx, next) => {
  let inquiry = ctx.request.body;
  try {
    // TODO 新加手机号字段
    // TODO 手机号，名称要唯一，不唯一抛错 
    let code = 0
    let message = ''
    let data = []
    let [rows, fields] = await ctx.db.query(`SELECT username FROM users WHERE username = ? LIMIT 1`, [username])
    if (rows.length && rows[0].username) {
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
    [rows, fields] = await ctx.db.execute('INSERT INTO users (username, password, mobile) VALUES(?,?,?)', [username, password, mobile])
    if (rows && rows.insertId) return ctx.Back({ code, message }, rows.insertId);
  } catch (error) {
    ctx.Throw(403, error.message);
    ctx.Back(error.message, ctx.ErrCode.DATABASE_ERROR);
  }
}

const get = async (ctx, next) => {
  try {
    let { mobile, password } = ctx.request.body;
    // 手机号登录
    const [rows, fields] = await ctx.db.query(`SELECT * FROM users WHERE mobile = ? AND password = ? LIMIT 1`, [mobile, password])
    if (!rows.length) {
        ctx.response.status = 200;
        return ctx.body = {
          code: 400001,
          msg: '用户名或密码不正确'
        }
    }
    // 设置 cookies
    const token = jsonwebtoken.sign(
      { username: rows[0].username, id: rows[0].id },
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

const user = async (ctx, next) => {
  try {
    const token = ctx.cookies.get('user')
    const user = jsonwebtoken.verify(token, SECRET)
    if (!user || !user.id) return ctx.body = ctx.errCode['PARAMS_ERROR']
    let [rows, fields] = await ctx.db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [user.id])
    if (!rows.length) {
      ctx.response.status = 200;
      return ctx.body = {
        code: 400001,
        msg: '获取用户信息失败'
      }
    }
    [rows, fields] = await ctx.db.query('SELECT * FROM inquiry WHERE user_id = ?', [user.id])
    return ctx.Back({ code: 0, message: '' }, rows);
  } catch (error) {
    ctx.Throw(403, error.message);
    ctx.Back(error.message, ctx.ErrCode.DATABASE_ERROR);
  }
}

  // TODO 根据用户id修改用户信息
  const recall = async (ctx, next) => {
    try {
      let { username, mobile, password, id } = ctx.request.body;
      const [rows, fields] = await ctx.db.query('UPDATE Users SET (username, mobile, password) WHERE id = ?', [username, mobile, password, id])
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
  const urge = async (ctx, next) => {
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
  create,
  get,
  user,
  recall,
  urge
}
