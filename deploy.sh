#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 静态网站部署脚本${NC}"
echo -e "${BLUE}====================${NC}"
echo ""

# 项目信息
USERNAME="zodastream-dev"
REPO_NAME="my-static-website"
PROJECT_DIR="/root/.openclaw/workspace/my-static-website"
SITE_URL="https://${USERNAME}.github.io/${REPO_NAME}"

echo -e "${GREEN}📋 项目信息:${NC}"
echo "用户名: ${USERNAME}"
echo "仓库名: ${REPO_NAME}"
echo "项目目录: ${PROJECT_DIR}"
echo "网站地址: ${SITE_URL}"
echo ""

# 检查是否在项目目录
cd "$PROJECT_DIR" || {
    echo -e "${RED}❌ 错误: 无法进入项目目录${NC}"
    exit 1
}

echo -e "${GREEN}🔍 检查Git状态...${NC}"
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ 错误: 项目目录不是Git仓库${NC}"
    exit 1
fi

# 检查远程仓库
echo -e "${GREEN}🔗 检查远程仓库...${NC}"
if git remote | grep -q "origin"; then
    echo "✅ 远程仓库已配置"
    git remote -v
else
    echo -e "${YELLOW}⚠️  远程仓库未配置${NC}"
    echo -e "${YELLOW}请先创建GitHub仓库: https://github.com/new${NC}"
    echo ""
    echo -e "${BLUE}📝 创建仓库后，执行以下命令:${NC}"
    echo "git remote add origin https://github.com/${USERNAME}/${REPO_NAME}.git"
    echo "git push -u origin main"
    echo ""
    echo -e "${BLUE}🔗 仓库创建链接:${NC}"
    echo "https://github.com/new"
    echo ""
    echo -e "${BLUE}📋 创建信息:${NC}"
    echo "Repository name: ${REPO_NAME}"
    echo "Description: 我的第一个静态网站项目"
    echo "Public: ✓"
    echo "Initialize this repository with: (全部不勾选)"
    echo ""
    exit 0
fi

# 推送代码
echo ""
echo -e "${GREEN}📤 推送代码到GitHub...${NC}"
echo "正在推送，请稍候..."

if git push origin main; then
    echo -e "${GREEN}✅ 代码推送成功！${NC}"
else
    echo -e "${RED}❌ 代码推送失败${NC}"
    echo "可能的原因:"
    echo "1. 网络连接问题"
    echo "2. 认证失败 (用户名/密码错误)"
    echo "3. 仓库权限问题"
    echo ""
    echo -e "${YELLOW}💡 建议:${NC}"
    echo "1. 确认可以访问 GitHub"
    echo "2. 检查用户名和密码"
    echo "3. 手动执行: git push origin main"
    exit 1
fi

echo ""
echo -e "${GREEN}🌐 网站部署信息:${NC}"
echo ""
echo -e "${BLUE}📊 项目文件:${NC}"
find . -type f -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.md" | sort
echo ""
echo -e "${BLUE}📁 文件统计:${NC}"
echo "HTML文件: $(find . -name "*.html" | wc -l)"
echo "CSS文件: $(find . -name "*.css" | wc -l)"
echo "JS文件: $(find . -name "*.js" | wc -l)"
echo "总文件数: $(find . -type f | wc -l)"
echo ""
echo -e "${BLUE}🔗 重要链接:${NC}"
echo "1. GitHub仓库: https://github.com/${USERNAME}/${REPO_NAME}"
echo "2. 网站地址: ${SITE_URL}"
echo "3. GitHub Pages设置: https://github.com/${USERNAME}/${REPO_NAME}/settings/pages"
echo ""
echo -e "${YELLOW}⚠️  重要提示:${NC}"
echo "1. 网站可能需要1-2分钟才能访问"
echo "2. 如果显示404，请检查GitHub Pages设置"
echo "3. 确认分支设置为 'main'，文件夹为 '/ (root)'"
echo ""
echo -e "${GREEN}🎉 部署完成！${NC}"
echo "请访问: ${SITE_URL}"
echo ""
echo -e "${BLUE}📝 后续步骤:${NC}"
echo "1. 访问网站检查效果"
echo "2. 如需更新，修改文件后再次执行此脚本"
echo "3. 或使用: git add . && git commit -m '更新' && git push"