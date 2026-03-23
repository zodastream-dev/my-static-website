#!/usr/bin/env node

/**
 * 自动更新版本号脚本
 * 每次部署前运行此脚本，版本号自动递增
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 开始自动更新版本号...');

// 读取当前版本
const versionFile = path.join(__dirname, 'version.json');
let versionData;

try {
    versionData = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
    console.log(`📦 当前版本: ${versionData.version}`);
} catch (error) {
    console.error('❌ 读取版本文件失败:', error);
    process.exit(1);
}

// 解析当前版本号
const [major, minor, patch] = versionData.version.split('.').map(Number);

// 增加补丁版本号（每次部署增加0.0.1）
const newPatch = patch + 1;
const newVersion = `${major}.${minor}.${newPatch}`;

// 更新构建号（基于当前时间）
const now = new Date();
const buildNumber = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}.${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;

// 更新版本数据
versionData.version = newVersion;
versionData.build = buildNumber;
versionData.lastUpdated = now.toISOString();

// 保存版本文件
fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2), 'utf8');

console.log(`✅ 版本更新完成!`);
console.log(`🚀 新版本: ${newVersion}`);
console.log(`🔧 构建号: ${buildNumber}`);
console.log(`🕒 更新时间: ${now.toISOString()}`);

// 更新HTML文件中的版本号
console.log('🔄 更新HTML文件中的版本号...');

const htmlFiles = ['index.html', 'convo.html'];

htmlFiles.forEach(fileName => {
    const filePath = path.join(__dirname, fileName);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 更新版本号（查找 vX.X.X 格式）
        const versionRegex = /v\d+\.\d+\.\d+/g;
        if (versionRegex.test(content)) {
            content = content.replace(versionRegex, `v${newVersion}`);
            console.log(`✅ 更新 ${fileName}: v${newVersion}`);
        } else {
            console.log(`⚠️  ${fileName} 中没有找到版本号`);
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
    } catch (error) {
        console.error(`更新 ${fileName} 失败:`, error);
    }
});

console.log('🎉 版本号自动更新完成!');
console.log('');
console.log('📊 版本信息摘要:');
console.log(`   版本号: v${newVersion}`);
console.log(`   构建号: ${buildNumber}`);
console.log(`   更新时间: ${now.toISOString()}`);
console.log(`   下次部署前运行: node auto-update-version.js`);