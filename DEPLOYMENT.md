# 🚀 星梦通 - 生产环境部署指南

完整的部署指南，让你的解梦网站运行在 `https://zhibeimao.com/jiemeng`

## 📋 前置要求

- Ubuntu 20.04+ / CentOS 7+ / Debian 10+
- Node.js 16+ (推荐 18+)
- Nginx 1.18+
- 域名已解析到服务器 IP
- Root 或 sudo 权限

## 🔧 步骤 1: 安装 Node.js

### Ubuntu/Debian
```bash
# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v
npm -v
```

### CentOS/RHEL
```bash
# 安装 Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node -v
npm -v
```

## 📦 步骤 2: 部署应用

### 2.1 克隆代码
```bash
# 创建应用目录
sudo mkdir -p /var/www/xingmingtong
cd /var/www/xingmingtong

# 克隆代码（或上传代码）
git clone <your-repo-url> .
# 或者使用 scp/rsync 上传代码
```

### 2.2 运行部署脚本
```bash
# 赋予执行权限
chmod +x deploy.sh

# 运行部署脚本
./deploy.sh
```

### 2.3 配置环境变量
```bash
# 编辑 .env 文件
nano .env

# 填入你的 API 密钥
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxx
CLAUDE_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
# ... 其他配置
```

### 2.4 重启应用
```bash
pm2 restart xingmingtong-dream
```

## 🔒 步骤 3: 安装 SSL 证书

### 3.1 安装 Certbot
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install -y certbot python3-certbot-nginx
```

### 3.2 获取 SSL 证书
```bash
# 为你的域名申请证书
sudo certbot certonly --nginx -d zhibeimao.com -d www.zhibeimao.com

# 按提示输入邮箱等信息
```

证书将保存在：
- 证书: `/etc/letsencrypt/live/zhibeimao.com/fullchain.pem`
- 私钥: `/etc/letsencrypt/live/zhibeimao.com/privkey.pem`

### 3.3 自动续期
```bash
# 测试自动续期
sudo certbot renew --dry-run

# 设置自动续期（cron）
sudo crontab -e

# 添加以下行（每天凌晨 2 点检查续期）
0 2 * * * /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
```

## 🌐 步骤 4: 配置 Nginx

### 4.1 选择配置方式

#### 方式 A: 子路径部署 `/jiemeng`（推荐）
如果你的网站已有其他内容，想把解梦作为子路径

```bash
# 复制配置文件
sudo cp nginx.conf /etc/nginx/sites-available/zhibeimao.com

# 编辑你现有的 Nginx 配置，添加 /jiemeng location 配置
sudo nano /etc/nginx/sites-available/zhibeimao.com
```

#### 方式 B: 根路径部署
如果你想让解梦网站作为主站点

```bash
# 使用简化配置
sudo cp nginx-simple.conf /etc/nginx/sites-available/zhibeimao.com
```

### 4.2 启用配置
```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/zhibeimao.com /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

### 4.3 配置防火墙
```bash
# Ubuntu (UFW)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload

# CentOS (Firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## ✅ 步骤 5: 验证部署

### 5.1 检查服务状态
```bash
# 检查 Node.js 应用
pm2 status
pm2 logs xingmingtong-dream

# 检查 Nginx
sudo systemctl status nginx

# 检查端口
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :443
```

### 5.2 访问网站
在浏览器中访问：
- **子路径部署**: https://zhibeimao.com/jiemeng
- **根路径部署**: https://zhibeimao.com

### 5.3 测试 API
```bash
# 测试健康检查
curl https://zhibeimao.com/jiemeng/health
# 或
curl https://zhibeimao.com/health

# 应该返回: {"status":"ok","timestamp":"..."}
```

## 📊 监控和维护

### 查看应用日志
```bash
# 实时查看日志
pm2 logs xingmingtong-dream

# 查看错误日志
pm2 logs xingmingtong-dream --err

# 查看最近 100 行
pm2 logs xingmingtong-dream --lines 100
```

### 常用 PM2 命令
```bash
# 重启应用
pm2 restart xingmingtong-dream

# 停止应用
pm2 stop xingmingtong-dream

# 删除应用
pm2 delete xingmingtong-dream

# 查看详细信息
pm2 info xingmingtong-dream

# 监控面板
pm2 monit
```

### 更新应用
```bash
cd /var/www/xingmingtong

# 拉取最新代码
git pull

# 安装新依赖（如果有）
npm install

# 重启应用
pm2 restart xingmingtong-dream
```

## 🔧 故障排查

### 问题 1: 502 Bad Gateway
```bash
# 检查 Node.js 应用是否运行
pm2 status

# 检查端口是否被占用
sudo netstat -tlnp | grep :3000

# 查看应用日志
pm2 logs xingmingtong-dream
```

### 问题 2: SSL 证书错误
```bash
# 检查证书文件
sudo ls -la /etc/letsencrypt/live/zhibeimao.com/

# 测试证书
sudo certbot certificates

# 强制续期
sudo certbot renew --force-renewal
```

### 问题 3: AI 服务调用失败
```bash
# 检查环境变量
cat .env

# 测试 API 密钥
# 查看应用日志中的错误信息
pm2 logs xingmingtong-dream --err
```

## 🔐 安全建议

1. **保护环境变量**
```bash
sudo chmod 600 /var/www/xingmingtong/.env
sudo chown www-data:www-data /var/www/xingmingtong/.env
```

2. **限制访问频率**（Nginx 配置）
```nginx
# 在 server 块中添加
limit_req_zone $binary_remote_addr zone=dream_limit:10m rate=10r/m;

location /jiemeng {
    limit_req zone=dream_limit burst=5;
    # ... 其他配置
}
```

3. **启用 HTTPS 严格传输安全**
```nginx
# 在 SSL server 块中添加
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## 📈 性能优化

### 1. 启用 Gzip 压缩（已在配置中）

### 2. 配置 CDN（可选）
使用 Cloudflare 或其他 CDN 服务加速静态资源

### 3. 数据库缓存（未来扩展）
添加 Redis 缓存常见解梦结果

## 🎯 快速命令参考

```bash
# 部署新版本
cd /var/www/xingmingtong && git pull && npm install && pm2 restart xingmingtong-dream

# 查看实时日志
pm2 logs xingmingtong-dream --lines 50

# 检查系统资源
pm2 monit

# 重启所有服务
pm2 restart all && sudo systemctl reload nginx
```

## 📞 获取帮助

如果遇到问题：
1. 查看应用日志: `pm2 logs xingmingtong-dream`
2. 查看 Nginx 日志: `sudo tail -f /var/log/nginx/error.log`
3. 检查系统日志: `sudo journalctl -xe`

---

部署完成后，你的解梦网站将通过 `https://zhibeimao.com/jiemeng` 访问！🌙✨
