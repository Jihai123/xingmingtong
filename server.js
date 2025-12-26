require('dotenv').config();
const express = require('express');
const path = require('path');
const { interpretDream } = require('./services/dreamInterpreter');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());
app.use(express.static('public'));

// API路由
app.post('/api/interpret', async (req, res) => {
    try {
        const { dream } = req.body;

        if (!dream || typeof dream !== 'string') {
            return res.status(400).json({ error: '请提供有效的梦境描述' });
        }

        if (dream.trim().length < 10) {
            return res.status(400).json({ error: '梦境描述过短，请提供更详细的内容' });
        }

        console.log('📝 收到解梦请求，梦境长度:', dream.length);

        // 调用解梦服务
        const result = await interpretDream(dream);

        console.log('✅ 解梦完成，提供商:', result.provider);

        res.json({
            interpretation: result.interpretation,
            provider: result.provider
        });

    } catch (error) {
        console.error('❌ 解梦服务错误:', error.message);
        res.status(500).json({ error: error.message || '解梦服务暂时不可用，请稍后重试' });
    }
});

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
    console.log('🌙 星梦通服务器启动成功');
    console.log(`🔗 访问地址: http://localhost:${PORT}`);
    console.log(`🤖 AI提供商: ${process.env.AI_PROVIDER || 'claude'}`);
    console.log('⭐ 开始解梦之旅...\n');
});
