const sqlite3 = require('sqlite3').verbose(); // 引入 sqlite3 模块，并开启详细日志
const db = new sqlite3.Database('./db.sqlite'); // 新建一个数据库连接，使用文件 db.sqlite

// 创建表的操作，确保只执行一次
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS works (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            image TEXT
        )
    `);
});

module.exports = db; // 导出数据库对象，供其他文件调用
