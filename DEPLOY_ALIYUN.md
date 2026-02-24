# 阿里云服务器部署指南

本文档介绍如何将后端代码部署到阿里云 ECS 服务器，供微信小程序调用。

## 环境要求

- Node.js 18+
- MySQL 5.7+
- Nginx（可选，用于 HTTPS 和静态文件）

---

## 一、阿里云 ECS 配置

### 1. 购买并初始化 ECS

- 推荐配置：2核 4G Ubuntu 20.04 LTS
- 记牢服务器的公网 IP 地址

### 2. 安全组配置

在阿里云控制台添加安全组规则：

| 协议 | 端口 | 用途 |
|------|------|------|
| TCP | 80 | HTTP |
| TCP | 443 | HTTPS |
| TCP | 3000 | 后端服务 |
| TCP | 22 | SSH |

---

## 二、服务器环境搭建

### 1. 连接服务器

```bash
ssh root@你的服务器IP
```

### 2. 安装 Node.js

```bash
# 使用 NodeSource 仓库安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node -v
npm -v
```

### 3. 安装 MySQL

```bash
# 安装 MySQL
sudo apt update
sudo apt install -y mysql-server

# 启动 MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# 安全配置（设置 root 密码）
sudo mysql_secure_installation
```

### 4. 安装 PM2（进程管理）

```bash
sudo npm install -g pm2
```

---

## 三、部署代码

### 1. 克隆代码

```bash
cd /var/www
git clone https://github.com/Believer24/footballLineUp.git
cd footballLineUp/server
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
# 复制并编辑 .env 文件
cp .env.example .env
nano .env
```

配置内容：

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的MySQL密码
DB_NAME=pitchmaster
PORT=3000
```

### 4. 创建数据库

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE pitchmaster CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 5. 导入数据

```bash
mysql -u root -p pitchmaster < ../pitchmaster.sql
```

### 6. 启动服务

```bash
# 使用 PM2 启动
pm2 start index.js --name football-api

# 设置开机自启
pm2 startup
pm2 save
```

---

## 四、配置 Nginx（可选）

如果需要 HTTPS，建议使用 Nginx 配置 SSL 证书。

### 1. 安装 Nginx

```bash
sudo apt install -y nginx
```

### 2. 配置 Nginx

```bash
sudo nano /etc/nginx/sites-available/football-api
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name 你的域名或IP;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. 启用配置

```bash
sudo ln -s /etc/nginx/sites-available/football-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 五、小程序配置

### 1. 修改小程序 API 地址

在小程序代码中，将 `BASE_URL` 修改为：

```javascript
const BASE_URL = 'http://你的服务器IP:3000'
// 或使用域名（如果已配置）
const BASE_URL = 'https://你的域名'
```

### 2. 配置合法域名

在微信公众平台 -> 开发管理 -> 开发设置 -> 服务器域名：

- request 合法域名：添加 `http://你的服务器IP` 或你的域名
- websockets 合法域名（如使用）

---

## 六、常用命令

```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs football-api

# 重启服务
pm2 restart football-api

# 停止服务
pm2 stop football-api
```

---

## 七、常见问题

### 1. 数据库连接失败

- 检查 .env 配置是否正确
- 确认 MySQL 用户权限
- 检查防火墙是否允许 3306 端口

### 2. 小程序无法访问

- 确认安全组已开放对应端口
- 检查服务是否正常启动：`pm2 status`
- 查看日志排查问题：`pm2 logs football-api`

### 3. HTTPS 配置

- 建议使用 Let's Encrypt 免费证书
- 或在阿里云申请免费 SSL 证书
