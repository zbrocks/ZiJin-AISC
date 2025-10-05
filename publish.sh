#!/bin/bash

# ZiJin A.I.S.C. 项目发布脚本
# 此脚本用于将项目文件打包为发布版本

# 设置颜色变量
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

# 检查是否为Mac系统
if [[ $OSTYPE != 'darwin'* ]]; then
    echo -e "${RED}警告: 此脚本设计用于macOS系统。在其他系统上可能需要调整。${NC}"
fi

# 创建发布目录
PUBLISH_DIR="publish"
if [ -d "$PUBLISH_DIR" ]; then
    echo -e "${BLUE}清理旧的发布目录...${NC}"
    rm -rf "$PUBLISH_DIR"
fi

# 创建必要的目录结构
echo -e "${BLUE}创建发布目录结构...${NC}"
mkdir -p "$PUBLISH_DIR/assets/css"
mkdir -p "$PUBLISH_DIR/assets/js"
mkdir -p "$PUBLISH_DIR/assets/images"
mkdir -p "$PUBLISH_DIR/assets/json"
mkdir -p "$PUBLISH_DIR/pages/articles"
mkdir -p "$PUBLISH_DIR/pages/events"
mkdir -p "$PUBLISH_DIR/pages/rules"

# 复制HTML文件
echo -e "${BLUE}复制HTML文件...${NC}"
cp index.html "$PUBLISH_DIR/"
cp 404.html "$PUBLISH_DIR/"
cp README.md "$PUBLISH_DIR/"
cp RELEASE_NOTES.md "$PUBLISH_DIR/"
cp VERSION "$PUBLISH_DIR/"
cp .gitignore "$PUBLISH_DIR/"

# 复制页面文件
cp pages/FAQ.html "$PUBLISH_DIR/pages/"
cp pages/hall-of-fame.html "$PUBLISH_DIR/pages/"
cp pages/team.html "$PUBLISH_DIR/pages/"
cp pages/articles/* "$PUBLISH_DIR/pages/articles/"
cp pages/events/* "$PUBLISH_DIR/pages/events/"
cp pages/rules/* "$PUBLISH_DIR/pages/rules/"

# 复制CSS文件
cp assets/css/* "$PUBLISH_DIR/assets/css/"

# 复制JavaScript文件
cp assets/js/* "$PUBLISH_DIR/assets/js/"
cp -r assets/js/events "$PUBLISH_DIR/assets/js/"

# 复制JSON数据
cp -r assets/json/* "$PUBLISH_DIR/assets/json/"

# 复制图片资源
echo -e "${BLUE}复制图片资源...${NC}"
cp -r assets/images/* "$PUBLISH_DIR/assets/images/"

# 创建发布压缩包
ZIP_FILE="ZiJin-AISC-$(cat VERSION | grep '版本' | awk -F': ' '{print $2}').zip"
echo -e "${BLUE}创建发布压缩包 $ZIP_FILE...${NC}"
cd "$PUBLISH_DIR"
zip -r ../"$ZIP_FILE" ./*
cd ..

# 清理临时发布目录
rm -rf "$PUBLISH_DIR"

echo -e "${GREEN}发布成功!\n压缩包已创建: $ZIP_FILE${NC}"
echo -e "${GREEN}您可以将此压缩包上传到任何静态Web服务器进行部署。${NC}"

# 给脚本添加执行权限
chmod +x "$0"