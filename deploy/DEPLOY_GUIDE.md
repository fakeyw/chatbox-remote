### 部署指南

#### 1. 克隆仓库

将仓库克隆至本地并进入部署目录：

```bash
git clone <repository_url>
cd chatbox_remote/deploy
```

#### 2. 配置环境变量

修改 `docker-compose.yml` 中的 `ACCESS_SECRET` 字段。该值将作为您访问 Chatbox 页面时的认证登录密码。

#### 3. 构建并启动服务

执行以下命令以构建镜像并以后台模式启动容器：

```bash
docker compose up -d --build
```

#### 4. Nginx 代理（可选）

如需配置 Nginx 反向代理，请参考项目中的 `chatbox_nginx.conf` 配置文件。

#### 5. 初始化管理账户（可选）

查看容器日志以获取初始化链接：

```bash
docker compose logs -f
```

获取形如 `http://0.0.0.0:8090/_/xxxxxxxxxxx` 的链接。在修改为正确的 IP 或域名后访问该链接，以注册 PocketBase 管理账户。**请勿将此链接发送给他人。**

#### 6. 安全加固（可选，但是强烈建议）

为确保后端接口安全，请执行以下操作：

1. 进入 PocketBase 管理后台，切换到 **user** 表。
2. 点击左上角齿轮图标进入设置，选择 **API Rules** 页面。
3. 将所有选项的权限均设置为 **"Set Superusers Only"**。

#### 7. 访问服务

打开浏览器并访问服务器地址（域名或 IP），输入预设的密码即可登录使用。

#### 8. 数据库审计日志

`deploy/pb_hooks/audit.pb.js` 用于打印具体用户（类型、ID）对数据表（collection）的访问记录，同样用 `docker compose logs -f` 查看

---
### Deployment Guide

#### 1. Clone the Repository

Clone the repository to your local machine and navigate to the deployment directory:

```bash
git clone <repository_url>
cd chatbox_remote/deploy
```

#### 2. Configure Environment Variables

Edit the `docker-compose.yml` file and modify the `ACCESS_SECRET` value. This will be your password for authenticating and logging into the Chatbox interface.

#### 3. Build and Start Services

Run the following command to build the image and start the containers in detached mode:

```bash
docker compose up -d --build
```

#### 4. Nginx Proxy (Optional)

If you require an Nginx reverse proxy, refer to the provided configuration template: `chatbox_nginx.conf`.

#### 5. Initialize Administrative Account (Optional)

Monitor the container logs to retrieve the initialization link:

```bash
docker compose logs -f
```

Locate a link similar to `http://0.0.0.0:8090/_/xxxxxxxxxxx`. Replace the IP or domain as necessary and access it in your browser to register the PocketBase admin account. **Do not share this link with others.**

#### 6. Security Configuration (Optional, but Recommend)

To secure the backend API, perform the following steps:

1. Navigate to the **user** table in the PocketBase admin panel.
2. Click the **Gear Icon** (Settings) in the top-left corner and go to **API Rules**.
3. Set all options to **"Set Superusers Only"**.

#### 7. Access

Visit your server's IP or domain address and enter your password to log in.

#### 8. Database Audit Log

`deploy/pb_hooks/audit.pb.js` is used to log access records of specific users (including type and ID) to data tables (collections).

These logs can also be viewed using `docker compose logs -f`.

