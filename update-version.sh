#!/bin/bash

# 自动更新版本号的简单脚本
# 每次部署前运行此脚本

echo "🔄 开始更新版本号..."

# 获取当前时间
BUILD_TIME=$(date +"%Y.%m.%d.%H%M")
echo "📅 构建时间: $BUILD_TIME"

# 读取当前版本
if [ -f "version.json" ]; then
    CURRENT_VERSION=$(grep -o '"version": "[^"]*"' version.json | cut -d'"' -f4)
    echo "📦 当前版本: $CURRENT_VERSION"
    
    # 解析版本号
    IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
    
    # 增加补丁版本号
    NEW_PATCH=$((PATCH + 1))
    NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"
    
    echo "🚀 新版本: $NEW_VERSION"
    
    # 更新version.json
    sed -i "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/g" version.json
    sed -i "s/\"build\": \"[^\"]*\"/\"build\": \"$BUILD_TIME\"/g" version.json
    sed -i "s/\"lastUpdated\": \"[^\"]*\"/\"lastUpdated\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"/g" version.json
    
    # 更新HTML文件中的版本号
    echo "🔄 更新HTML文件..."
    
    # 更新index.html
    if [ -f "index.html" ]; then
        sed -i "s/v[0-9]\+\.[0-9]\+\.[0-9]\+/v$NEW_VERSION/g" index.html
        echo "✅ 更新 index.html"
    fi
    
    # 更新convo.html
    if [ -f "convo.html" ]; then
        sed -i "s/v[0-9]\+\.[0-9]\+\.[0-9]\+/v$NEW_VERSION/g" convo.html
        echo "✅ 更新 convo.html"
    fi
    
    echo ""
    echo "🎉 版本更新完成!"
    echo "📊 版本信息:"
    echo "  版本号: v$NEW_VERSION"
    echo "  构建号: $BUILD_TIME"
    echo "  更新时间: $(date)"
    
else
    echo "❌ 找不到 version.json 文件"
    exit 1
fi