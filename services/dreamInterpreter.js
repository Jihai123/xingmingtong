const { callHuggingFace } = require('./aiProviders/huggingface');
const { callClaude } = require('./aiProviders/claude');
const { callOpenAI } = require('./aiProviders/openai');
const { callGemini } = require('./aiProviders/gemini');
const { createDreamPrompt } = require('./promptGenerator');

/**
 * 解梦主函数
 * 优先使用 HuggingFace，失败后 fallback 到其他 AI 服务
 */
async function interpretDream(dreamDescription) {
    const prompt = createDreamPrompt(dreamDescription);

    let interpretation;
    let usedProvider = 'unknown';

    try {
        console.log('🤖 Step 1: 尝试 HuggingFace API (优先)...');
        interpretation = await callHuggingFace(prompt);
        usedProvider = 'huggingface';
        console.log('✅ 使用 HuggingFace API 生成成功');
    } catch (hfError) {
        // HuggingFace 失败，fallback 到现有模型
        console.warn('⚠️  HuggingFace 调用失败:', hfError.message);
        console.log('🔄 Step 2: Fallback 到原有 AI 服务...');

        const provider = process.env.AI_PROVIDER || 'claude';
        console.log('   提供商:', provider);

        try {
            switch (provider.toLowerCase()) {
                case 'claude':
                    interpretation = await callClaude(prompt);
                    usedProvider = 'claude';
                    break;
                case 'openai':
                    interpretation = await callOpenAI(prompt);
                    usedProvider = 'openai';
                    break;
                case 'gemini':
                    interpretation = await callGemini(prompt);
                    usedProvider = 'gemini';
                    break;
                default:
                    throw new Error(`不支持的 AI 提供商: ${provider}`);
            }
            console.log(`✅ 使用 ${provider} API 生成成功`);
        } catch (aiError) {
            console.error('❌ 原有 AI 服务也失败:', aiError.message);
            throw new Error(`所有 AI 服务均失败: HF(${hfError.message}), ${provider}(${aiError.message})`);
        }
    }

    return {
        interpretation,
        provider: usedProvider
    };
}

module.exports = { interpretDream };
