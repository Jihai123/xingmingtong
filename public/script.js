// DOM元素
const dreamInput = document.getElementById('dreamInput');
const interpretBtn = document.getElementById('interpretBtn');
const charCount = document.getElementById('charCount');
const loadingSection = document.getElementById('loadingSection');
const resultSection = document.getElementById('resultSection');
const resultContent = document.getElementById('resultContent');
const aiProvider = document.getElementById('aiProvider');
const newDreamBtn = document.getElementById('newDreamBtn');

// 字符计数
dreamInput.addEventListener('input', () => {
    const count = dreamInput.value.length;
    charCount.textContent = count;
});

// 开始解梦
interpretBtn.addEventListener('click', async () => {
    const dreamText = dreamInput.value.trim();

    if (!dreamText) {
        alert('请先描述你的梦境');
        return;
    }

    if (dreamText.length < 10) {
        alert('请提供更详细的梦境描述（至少10个字）');
        return;
    }

    // 显示加载状态
    interpretBtn.disabled = true;
    loadingSection.classList.remove('hidden');
    resultSection.classList.add('hidden');

    try {
        const response = await fetch('/api/interpret', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dream: dreamText })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || '解梦失败，请稍后重试');
        }

        // 显示结果
        displayResult(data.interpretation, data.provider);

    } catch (error) {
        console.error('解梦错误:', error);
        alert(error.message || '解梦失败，请稍后重试');
        loadingSection.classList.add('hidden');
    } finally {
        interpretBtn.disabled = false;
    }
});

// 显示解梦结果
function displayResult(interpretation, provider) {
    loadingSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    // 打字机效果
    typeWriter(interpretation, resultContent, 30);

    // 显示AI提供商
    const providerNames = {
        'huggingface': '🤗 HuggingFace AI',
        'claude': '🧠 Claude AI',
        'openai': '🤖 OpenAI',
        'gemini': '✨ Gemini AI'
    };
    aiProvider.textContent = providerNames[provider] || 'AI 解析';

    // 滚动到结果区域
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// 打字机效果
function typeWriter(text, element, speed = 30) {
    element.textContent = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// 解读新梦境
newDreamBtn.addEventListener('click', () => {
    dreamInput.value = '';
    charCount.textContent = '0';
    resultSection.classList.add('hidden');
    dreamInput.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 复制结果
function copyResult() {
    const text = resultContent.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('✅ 解梦结果已复制到剪贴板');
    }).catch(() => {
        showToast('❌ 复制失败，请手动复制');
    });
}

// 分享结果
function shareResult() {
    const text = resultContent.textContent;
    const shareText = `【星梦通 AI解梦】\n\n${text}\n\n来自星梦通 AI 解梦`;

    if (navigator.share) {
        navigator.share({
            title: '星梦通 AI解梦',
            text: shareText
        }).catch(() => {
            copyAndShowShareTip(shareText);
        });
    } else {
        copyAndShowShareTip(shareText);
    }
}

function copyAndShowShareTip(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('✅ 内容已复制，可以分享给朋友了');
    }).catch(() => {
        showToast('❌ 分享失败');
    });
}

// 提示消息
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(147, 51, 234, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);
        animation: slideDown 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Enter键提交
dreamInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        interpretBtn.click();
    }
});
