const express = require('express');             // 引入 express 模块，用来创建路由
const multer = require('multer');              // 引入 multer 模块，用于处理文件上传
const path = require('path');                  // Node 内置的 path 模块，用于处理文件路径
const db = require('../db');                   // 引入我们自己写的数据库模块
const router = express.Router();               // 创建一个“路由对象”，用于定义接口

// 设置文件上传的配置：上传到 uploads 文件夹，文件名用时间戳命名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');                  // 存到 uploads 目录下
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // 用时间戳+原文件后缀命名
    }
});
const upload = multer({ storage });            // 创建一个 multer 实例

// ====================== 接口 1：获取作品列表 ========================
router.get('/', (req, res) => {
    const query = 'SELECT * FROM works ORDER BY id DESC';
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message }); // 如果出错，返回错误信息
        }
        res.json(rows); // 正常返回数据：是一个数组
    });
});

// ====================== 接口 2：上传新作品 ========================
router.post('/', upload.single('image'), (req, res) => {
    const { title, description } = req.body;          // 从请求体中获取标题和描述
    const image = req.file ? req.file.filename : null; // 获取上传的图片文件名
    const query = 'INSERT INTO works (title, description, image) VALUES (?, ?, ?)';
    db.run(query, [title, description, image], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message }); // 返回错误
        }
        res.json({ success: true, id: this.lastID });  // 返回新建作品的 ID
    });
});

// ====================== 接口 3：删除作品 ========================
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const selectQuery = 'SELECT image FROM works WHERE id = ?';
    const deleteQuery = 'DELETE FROM works WHERE id = ?';

    db.get(selectQuery, [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: '作品不存在' });

        const fs = require('fs');
        const imagePath = `uploads/${row.image}`;

        // 删除图片文件
        if (row.image && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // 删除数据库记录
        db.run(deleteQuery, [id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    });
});

module.exports = router; // 导出路由对象，让 server.js 能加载这些接口