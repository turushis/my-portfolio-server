const express = require('express');       // 引入 express 模块
const cors = require('cors');             // 引入 cors 模块，允许跨域访问（让前端能访问后端接口）
const app = express();                    // 创建一个 express 应用
const worksRouter = require('./routes/works'); // 引入我们刚写的接口路由模块
const path = require('path');

app.use(cors());                          // 使用 cors 中间件，允许外部访问接口
app.use(express.json());                  // 支持解析 JSON 格式的请求体（POST 请求常用）
app.use('/uploads', express.static('uploads')); // 静态资源服务：让浏览器可以访问上传的图片
app.use('/api/works', worksRouter);       // 所有 /api/works 路由请求交给 worksRouter 来处理
app.use('/', express.static(path.join(__dirname, 'public')));

// 启动服务器，监听端口 3000
const PORT = process.env.PORT || 3000;    // 如果有系统环境变量 PORT 就用它，否则默认用 3000
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
