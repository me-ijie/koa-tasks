const mysql = require('mysql2');

module.exports = (opts = {}) => {
    // get the client
    // create the pool
    let pool = mysql.createPool(opts);

    // now get a Promise wrapped instance of that pool
    const promisePool = pool.promise();
    try {
        promisePool.query('SELECT 1 FROM dual');
        console.log('connect database success.');
    } catch (error) {
        throw error;
    }


    return async function createPool(ctx, next) {
        // query database using promises
        ctx.db = promisePool;
        await next();
    }
}