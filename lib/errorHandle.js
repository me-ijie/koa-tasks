
const ErrCode = require('../config/errCode');

module.exports = () => {
    return async function errHandle(ctx, next) {
      ctx.ErrCode = ErrCode;
      ctx.Throw = function Throw (code, errMsg = '') {
        ctx.status = code;
        ctx.response.message = errMsg;
      }

      ctx.Back = function Back(errDetail, data = []) {
        let { code, message } = errDetail;
        code = code ? code : 0;
        data = data ? data : '';
        message = message ? message : '';
        if (typeof(errDetail) === 'string')
          message = errDetail;
        ctx.body = { code, data, message };
      }
      await next();
    }
}