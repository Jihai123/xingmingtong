const axios = require('axios');

/**
 * 调用 Google Gemini API
 */
async function callGemini(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    if (!apiKey) {
        throw new Error('Gemini API key 未配置');
    }

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2000,
                    topP: 0.9
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text || text.trim().length < 100) {
            throw new Error('Gemini 返回内容过短或为空');
        }

        return text.trim();

    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.error?.message || error.message;

            if (status === 400) {
                throw new Error('Gemini API 请求参数错误');
            } else if (status === 403) {
                throw new Error('Gemini API key 无效或无权限');
            } else if (status === 429) {
                throw new Error('Gemini API 请求频率超限');
            } else if (status === 503) {
                throw new Error('Gemini API 服务不可用');
            } else {
                throw new Error(`Gemini API 错误 (${status}): ${message}`);
            }
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('Gemini API 请求超时');
        } else {
            throw new Error(`Gemini 调用失败: ${error.message}`);
        }
    }
}

module.exports = { callGemini };
