const mysql = require('mysql');
const config = require('../config/index');

// 创建连接池
const pool = mysql.createPool({
  host           : config.mysql.host,
  user           : config.mysql.user,
  password       : config.mysql.password,
  database       : config.mysql.database,
  connectionLimit: 10,
  multipleStatements: true
});

const query = (sql, callback) => {
  pool.getConnection((err, conn) => {
    if (err) {
      callback(err, null, null)
    } else {
      conn.query(sql, (qerr, vals, fields) => {
        // 释放连接
        conn.release()

        // 回调函数
        callback(qerr, vals, fields)
      })
    }
  })
}

module.exports = query

// 1、使用连接池示例

// const query = require(./pool);
// query("SELECT * FROM `user_info`", (err, vals, fields) => { })

// ------------------------------------------------------------------------------------

// 2、创建多条查询语句

// 启用多条语句查询
// var connection = mysql.creatConnection({ multipleStatements: true});
// 新建多条语句实例
// connection.query('sql statementq; sql statement2; sql statement3;', (err, data) => { 
// if (err) {
//     throw new Error(err);
// } else {
//     console.dir(data[0], data[1], data[2]);
// }
// })

// ------------------------------------------------------------------------------------