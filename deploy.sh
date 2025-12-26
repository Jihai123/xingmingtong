#!/bin/bash

# 星梦通 - 自动部署脚本

echo "🌙 星梦通部署脚本"
echo "===================="

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 检查 Node.js
echo -e "\n${YELLOW}1. 检查 Node.js 环境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未找到 Node.js，请先安装 Node.js${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js 版本: $(node -v)${NC}"

# 2. 检查 npm
echo -e "\n${YELLOW}2. 检查 npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ 未找到 npm${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm 版本: $(npm -v)${NC}"

# 3. 安装依赖
echo -e "\n${YELLOW}3. 安装依赖包...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 依赖安装成功${NC}"
else
    echo -e "${RED}❌ 依赖安装失败${NC}"
    exit 1
fi

# 4. 检查环境变量
echo -e "\n${YELLOW}4. 检查环境变量...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  未找到 .env 文件，正在复制示例文件...${NC}"
    cp .env.example .env
    echo -e "${RED}❌ 请编辑 .env 文件配置 API 密钥后重新运行${NC}"
    exit 1
fi
echo -e "${GREEN}✅ 环境变量文件存在${NC}"

# 5. 创建日志目录
echo -e "\n${YELLOW}5. 创建日志目录...${NC}"
mkdir -p logs
echo -e "${GREEN}✅ 日志目录创建成功${NC}"

# 6. 检查 PM2
echo -e "\n${YELLOW}6. 检查 PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  未找到 PM2，正在全局安装...${NC}"
    sudo npm install -g pm2
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PM2 安装成功${NC}"
    else
        echo -e "${RED}❌ PM2 安装失败，请手动安装: sudo npm install -g pm2${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ PM2 已安装${NC}"
fi

# 7. 启动应用
echo -e "\n${YELLOW}7. 启动应用...${NC}"
pm2 delete xingmingtong-dream 2>/dev/null || true
pm2 start ecosystem.config.js
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 应用启动成功${NC}"
else
    echo -e "${RED}❌ 应用启动失败${NC}"
    exit 1
fi

# 8. 设置开机自启
echo -e "\n${YELLOW}8. 设置开机自启动...${NC}"
pm2 save
pm2 startup
echo -e "${GREEN}✅ 请按照上面的提示执行命令以完成开机自启设置${NC}"

# 9. 显示状态
echo -e "\n${YELLOW}9. 应用状态:${NC}"
pm2 status

echo -e "\n${GREEN}===================="
echo -e "🎉 部署完成！"
echo -e "====================${NC}"
echo -e "\n📝 下一步操作："
echo -e "1. 配置 Nginx 反向代理（参考 nginx.conf）"
echo -e "2. 安装 SSL 证书（参考 DEPLOYMENT.md）"
echo -e "3. 访问 https://zhibeimao.com/jiemeng\n"

echo -e "📊 常用命令："
echo -e "  查看日志: ${YELLOW}pm2 logs xingmingtong-dream${NC}"
echo -e "  重启应用: ${YELLOW}pm2 restart xingmingtong-dream${NC}"
echo -e "  停止应用: ${YELLOW}pm2 stop xingmingtong-dream${NC}"
echo -e "  查看状态: ${YELLOW}pm2 status${NC}"
echo -e ""
