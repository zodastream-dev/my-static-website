#!/bin/bash

# 用户认证系统部署脚本
# 将认证系统部署到GitHub Pages

set -e  # 遇到错误时退出

echo "🚀 开始部署用户认证系统到 openclaw.yookeer.com"

# 检查当前目录
if [ ! -f "index.html" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查Git状态
echo "📊 检查Git状态..."
if ! git status &> /dev/null; then
    echo "❌ 错误：这不是一个Git仓库"
    exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 发现未提交的更改，正在提交..."
    git add .
    git commit -m "feat: 添加用户认证系统
    
    - 添加完整的注册/登录/注销功能
    - 实现表单验证（用户名3-20位字母数字，密码8位字母数字）
    - 添加本地存储持久化
    - 创建响应式UI界面
    - 添加密码强度指示器
    - 创建测试页面和文档"
else
    echo "✅ 没有未提交的更改"
fi

# 推送到GitHub
echo "🔄 推送到GitHub..."
if git push origin main; then
    echo "✅ 代码推送成功"
else
    echo "❌ 推送失败，尝试强制推送？"
    read -p "是否强制推送？(y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push -f origin main
        echo "✅ 强制推送成功"
    else
        echo "❌ 部署取消"
        exit 1
    fi
fi

# 检查部署状态
echo "⏳ 等待GitHub Pages部署..."
sleep 10

echo "🔍 检查部署状态..."
echo "请访问以下链接检查部署："
echo "1. 主网站: https://zodastream-dev.github.io/my-static-website"
echo "2. 测试页面: https://zodastream-dev.github.io/my-static-website/test-auth.html"
echo "3. 认证页面: https://zodastream-dev.github.io/my-static-website/auth-modal.html"
echo ""
echo "📋 部署完成！接下来需要："
echo "1. 在阿里云DNS中添加CNAME记录："
echo "   主机记录: openclaw"
echo "   记录类型: CNAME"
echo "   记录值: zodastream-dev.github.io"
echo "2. 等待DNS生效（通常几分钟到几小时）"
echo "3. 访问 https://openclaw.yookeer.com 测试功能"
echo ""
echo "🧪 测试建议："
echo "1. 运行所有自动化测试"
echo "2. 测试注册、登录、注销功能"
echo "3. 测试表单验证"
echo "4. 测试响应式设计"
echo ""
echo "✅ 部署脚本执行完成！"

# 显示当前时间
echo "🕐 部署时间: $(date)"