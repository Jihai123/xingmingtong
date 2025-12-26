/**
 * 调用 HuggingFace Inference API
 * 使用 OpenAI 兼容格式的端点
 */
async function callHuggingFace(prompt) {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    const model = process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3.2-3B-Instruct';

    if (!apiKey) {
        throw new Error('HuggingFace API key 未配置');
    }

    // 动态导入 node-fetch
    const fetch = (await import('node-fetch')).default;

    // 设置超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, 120000); // 120秒超时

    try {
        // 使用 HuggingFace Router API (兼容 OpenAI 格式)
        const apiUrl = process.env.HUGGINGFACE_API_URL || 'https://router.huggingface.co/v1/chat/completions';

        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };

        const requestBody = {
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: model,
            temperature: 0.9,
            max_tokens: 1400,
            frequency_penalty: 0.4,
            presence_penalty: 0.3
        };

        console.log(`🤖 调用 HuggingFace API: ${model}`);
        const startTime = Date.now();

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const duration = Date.now() - startTime;

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ HuggingFace API 错误: ${response.status} ${response.statusText}`);
            console.error('   错误详情:', errorText);

            // 处理特定错误状态
            if (response.status === 503) {
                throw new Error('HuggingFace 模型正在加载中，请稍后重试');
            } else if (response.status === 401) {
                throw new Error('HuggingFace API key 无效');
            } else if (response.status === 429) {
                throw new Error('HuggingFace API 请求频率超限');
            } else {
                throw new Error(`HuggingFace API 错误: ${response.status}`);
            }
        }

        const result = await response.json();

        // 验证返回格式
        if (!result.choices || !result.choices[0] || !result.choices[0].message) {
            console.error('❌ HuggingFace 返回格式异常:', JSON.stringify(result, null, 2));
            throw new Error('HuggingFace 返回格式异常');
        }

        const content = result.choices[0].message.content;

        if (!content || content.trim().length < 100) {
            throw new Error('HuggingFace 返回内容过短或为空');
        }

        console.log(`✅ HuggingFace API 调用成功, 耗时: ${duration}ms`);
        console.log(`   返回内容长度: ${content.length} 字符`);

        return content.trim();

    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error('HuggingFace API 请求超时');
        }

        // 如果是已经抛出的自定义错误，直接传递
        if (error.message.includes('HuggingFace')) {
            throw error;
        }

        // 其他错误
        throw new Error(`HuggingFace 调用失败: ${error.message}`);
    }
}

module.exports = { callHuggingFace };
