const axios = require('axios');

/**
 * 调用 HuggingFace Inference API
 */
async function callHuggingFace(prompt) {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    const model = process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3.2-3B-Instruct';

    if (!apiKey) {
        throw new Error('HuggingFace API key 未配置');
    }

    try {
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${model}`,
            {
                inputs: prompt,
                parameters: {
                    max_new_tokens: 1500,
                    temperature: 0.7,
                    top_p: 0.9,
                    do_sample: true,
                    return_full_text: false
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000 // 60秒超时
            }
        );

        // HuggingFace API 响应格式处理
        let text = '';
        if (Array.isArray(response.data) && response.data.length > 0) {
            text = response.data[0].generated_text || response.data[0].text || '';
        } else if (response.data.generated_text) {
            text = response.data.generated_text;
        } else if (typeof response.data === 'string') {
            text = response.data;
        }

        if (!text || text.trim().length < 100) {
            throw new Error('HuggingFace 返回内容过短或为空');
        }

        return text.trim();

    } catch (error) {
        if (error.response) {
            // API返回错误
            const status = error.response.status;
            const message = error.response.data?.error || error.message;

            if (status === 503) {
                throw new Error('HuggingFace 模型正在加载中，请稍后重试');
            } else if (status === 401) {
                throw new Error('HuggingFace API key 无效');
            } else if (status === 429) {
                throw new Error('HuggingFace API 请求频率超限');
            } else {
                throw new Error(`HuggingFace API 错误 (${status}): ${message}`);
            }
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('HuggingFace API 请求超时');
        } else {
            throw new Error(`HuggingFace 调用失败: ${error.message}`);
        }
    }
}

module.exports = { callHuggingFace };
