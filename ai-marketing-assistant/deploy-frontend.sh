#!/bin/bash

# 1. 本地打包前端
cd $(dirname "$0")/frontend/admin-dashboard
npm install
npm run build

# 2. 上传打包文件到 ECS
scp -r build/* root@47.111.31.29:/usr/share/nginx/html/

echo "前端部署完成！" 