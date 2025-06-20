#!/bin/bash

# 1. 上传后端代码到 ECS
cd $(dirname "$0")
scp -r ai-marketing-assistant/backend root@47.111.31.29:/root/

# 2. 远程执行后端重启命令
ssh root@47.111.31.29 << 'EOF'
cd /root/backend
npm install
npx prisma generate
npm run build
pm2 restart ai-backend || pm2 start npm --name ai-backend -- run start
echo "后端部署并重启完成！"
EOF 