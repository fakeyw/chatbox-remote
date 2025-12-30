# 部署流程
1. clone 这个仓库
2. `cd chatbox_remote/deploy`
3. 把 `docker-compose.yml` 的 `POCKBASE_ADDR` 改成你的域名或者 IP
4. 执行 `docker compose up -d --build` 等待构建完成
5. 使用 nginx 代理 8090（或者其他你配置的端口）到你的域名，单页应用和存储 API 混合部署有一些特殊的技巧，参考 `deploy/chatbox_nginx.conf`
6. `docker compose logs -f` 查看容器日志，可以拿到一个 `http://0.0.0.0:8090/_/xxxxxxxxxxx` 的链接，（修改ip或域名后）访问此链接以注册 pocketbase 的管理账户
7. 创建存储表 `storage`, 添加两个字段
    - `key` plaintext, 非空
    - `value` plaintext, 长度上限设为 100000（默认 5000 太短，会导致写入失败）
8. 打开在 `docker-compser.yml` 中配置的地址，如 `https://chat.my.dev`(当然这个域名不是我的)

# Deployment
1. Clone this repository
2. `cd chatbox_remote/deploy`
3. Change `POCKBASE_ADDR` in `docker-compose.yml` to your domain or IP address
4. Execute `docker compose up -d --build` and wait for the build to complete
5. Use nginx to proxy port 8090 (or other configured port) to your domain. There are some special techniques for mixed deployment of single-page applications and storage APIs, refer to `deploy/chatbox_nginx.conf`
6. Use `docker compose logs -f` to view container logs, you'll get a link like `http://0.0.0.0:8090/_/xxxxxxxxxxx`. Access this link (after modifying IP or domain) to register the pocketbase admin account
7. Create storage table `storage`, add two fields:
    - `key` plaintext, not null
    - `value` plaintext, set maximum length to 100000 (default 5000 is too short and will cause write failures)
8. Open the address configured in `docker-compose.yml`, such as `https://chat.my.dev` (of course this domain is not mine)

