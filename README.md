# 🌙 星梦通 - AI解梦网站

一个神秘优雅的AI解梦网站，采用多层AI服务架构，优先使用HuggingFace API，失败时自动回退到其他AI服务。

## ✨ 特性

- 🎨 **神秘优雅的UI设计** - 星空背景、流畅动画、现代化界面
- 🤖 **智能AI解梦** - 基于心理学和文化象征的深度解析
- 🔄 **多层AI服务** - HuggingFace优先，支持Claude、OpenAI、Gemini回退
- 💫 **精心设计的提示词** - 让解梦真正触动人心
- 📱 **响应式设计** - 完美适配手机、平板、桌面

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并填入你的API密钥：

```bash
cp .env.example .env
```

在 `.env` 文件中配置：

```env
# HuggingFace API (优先使用)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
HUGGINGFACE_MODEL=meta-llama/Llama-3.2-3B-Instruct

# Fallback AI Provider (claude/openai/gemini)
AI_PROVIDER=claude
CLAUDE_API_KEY=your_claude_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022

# 或者使用 OpenAI
# AI_PROVIDER=openai
# OPENAI_API_KEY=your_openai_api_key_here

# 或者使用 Gemini
# AI_PROVIDER=gemini
# GEMINI_API_KEY=your_gemini_api_key_here

PORT=3000
```

### 3. 启动服务

```bash
# 生产环境
npm start

# 开发环境（自动重启）
npm run dev
```

### 4. 访问网站

打开浏览器访问：`http://localhost:3000`

## 🔑 获取API密钥

### HuggingFace (推荐优先使用)
1. 访问 [HuggingFace](https://huggingface.co/)
2. 注册账号并登录
3. 进入 [Access Tokens](https://huggingface.co/settings/tokens)
4. 创建新的 Access Token

### Claude
1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 创建API密钥

### OpenAI
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 创建API密钥

### Google Gemini
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建API密钥

## 🏗️ 项目结构

```
xingmingtong/
├── public/                 # 前端静态文件
│   ├── index.html         # 主页面
│   ├── style.css          # 样式文件
│   └── script.js          # 前端逻辑
├── services/              # 后端服务
│   ├── dreamInterpreter.js      # 解梦主服务
│   ├── promptGenerator.js       # 提示词生成器
│   └── aiProviders/             # AI提供商
│       ├── huggingface.js       # HuggingFace API
│       ├── claude.js            # Claude API
│       ├── openai.js            # OpenAI API
│       └── gemini.js            # Gemini API
├── server.js              # Express服务器
├── package.json           # 项目配置
├── .env.example          # 环境变量示例
└── README.md             # 项目文档
```

## 🎯 工作流程

1. **用户输入梦境** → 前端收集梦境描述
2. **发送到服务器** → POST /api/interpret
3. **生成提示词** → 创建精心设计的解梦提示词
4. **AI调用（优先级）**：
   - ⭐ **优先**：尝试 HuggingFace API
   - 🔄 **回退**：失败则使用 Claude/OpenAI/Gemini
5. **返回解析** → 展示AI生成的解梦结果
6. **打字机效果** → 优雅地展示解梦内容

## 💡 提示词设计

解梦提示词经过精心设计，包含4个层次：

1. **情感共鸣** - 理解梦者的情绪状态
2. **核心象征解析** - 深入解读梦境元素
3. **潜意识洞察** - 揭示深层心理需求
4. **心灵启发** - 提供积极的启发和建议

详见 `services/promptGenerator.js`

## 🎨 UI特性

- 🌌 动态星空背景
- 🌙 浮动月亮图标
- ✨ 渐变色彩方案
- 💫 流畅的动画效果
- 🔮 打字机效果展示
- 📱 移动端优化

## 🔧 技术栈

- **前端**: HTML5, CSS3, Vanilla JavaScript
- **后端**: Node.js, Express
- **AI服务**: HuggingFace, Claude, OpenAI, Gemini
- **HTTP客户端**: Axios

## 📝 注意事项

1. **API密钥安全**：
   - 不要将 `.env` 文件提交到Git
   - 生产环境使用环境变量

2. **AI服务选择**：
   - HuggingFace免费但可能有延迟
   - Claude/OpenAI/Gemini需要付费但响应快

3. **超时设置**：
   - 所有API调用默认60秒超时
   - HuggingFace模型可能需要加载时间

## 🌟 未来计划

- [ ] 添加梦境历史记录
- [ ] 支持梦境分类和标签
- [ ] 添加用户账户系统
- [ ] 提供PDF导出功能
- [ ] 多语言支持

## 📄 许可证

MIT License

## 🙏 致谢

感谢所有AI服务提供商的支持！

---

Made with 💜 by 星梦通团队
