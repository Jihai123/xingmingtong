const axios = require('axios');

/**
 * 调用 OpenAI API
 */
async function callOpenAI(prompt) {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
        throw new Error('OpenAI API key 未配置');
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        const text = response.data.choices[0].message.content;

        if (!text || text.trim().length < 100) {
            throw new Error('OpenAI 返回内容过短或为空');
        }

        return text.trim();

    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.error?.message || error.message;

            if (status === 401) {
                throw new Error('OpenAI API key 无效');
            } else if (status === 429) {
                throw new Error('OpenAI API 请求频率超限');
            } else if (status === 503) {
                throw new Error('OpenAI API 服务不可用');
            } else {
                throw new Error(`OpenAI API 错误 (${status}): ${message}`);
            }
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('OpenAI API 请求超时');
        } else {
            throw new Error(`OpenAI 调用失败: ${error.message}`);
        }
    }
}

module.exports = { callOpenAI };
