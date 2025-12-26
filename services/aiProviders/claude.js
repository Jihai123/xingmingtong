const axios = require('axios');

/**
 * 调用 Claude API
 */
async function callClaude(prompt) {
    const apiKey = process.env.CLAUDE_API_KEY;
    const model = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';

    if (!apiKey) {
        throw new Error('Claude API key 未配置');
    }

    try {
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: model,
                max_tokens: 2000,
                temperature: 0.7,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        const text = response.data.content[0].text;

        if (!text || text.trim().length < 100) {
            throw new Error('Claude 返回内容过短或为空');
        }

        return text.trim();

    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.error?.message || error.message;

            if (status === 401) {
                throw new Error('Claude API key 无效');
            } else if (status === 429) {
                throw new Error('Claude API 请求频率超限');
            } else if (status === 529) {
                throw new Error('Claude API 服务过载');
            } else {
                throw new Error(`Claude API 错误 (${status}): ${message}`);
            }
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('Claude API 请求超时');
        } else {
            throw new Error(`Claude 调用失败: ${error.message}`);
        }
    }
}

module.exports = { callClaude };
