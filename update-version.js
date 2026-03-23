#!/usr/bin/env node

// 自动更新版本号的脚本
// 使用方法: node update-version.js [major|minor|patch|build]

const fs = require('fs');
const path = require('path');

// 命令行参数
const args = process.argv.slice(2);
const updateType = args[0] || 'build';

// 版本文件路径
const versionFile = path.join(__dirname, 'version.json');

// 读取当前版本
let versionData;
try {
    versionData = JSON.parse(fs.readFileSync(versionFile, 'utf8'));
} catch (error) {
    console.error('读取版本文件失败:', error);
    process.exit(1);
}

// 解析当前版本号
const currentVersion = versionData.version;
const [major, minor, patch] = currentVersion.split('.').map(Number);

// 根据更新类型更新版本号
let newMajor = major;
let newMinor = minor;
let newPatch = patch;

switch (updateType) {
    case 'major':
        newMajor = major + 1;
        newMinor = 0;
        newPatch = 0;
        break;
    case 'minor':
        newMinor = minor + 1;
        newPatch = 0;
        break;
    case 'patch':
        newPatch = patch + 1;
        break;
    case 'build':
        // build 只更新构建号，不改变主版本号
        break;
    default:
        console.error('未知的更新类型:', updateType);
        console.log('可用类型: major, minor, patch, build');
        process.exit(1);
}

// 生成新版本号
const newVersion = `${newMajor}.${newMinor}.${newVersion}`;

// 更新构建号（基于日期时间）
const now = new Date();
const buildNumber = `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}.${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;

// 更新版本数据
versionData.version = newVersion;
versionData.build = buildNumber;
versionData.lastUpdated = now.toISOString();

// 保存版本文件
fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2), 'utf8');

// 更新HTML文件中的版本号
updateHtmlFiles(newVersion);

console.log('✅ 版本更新完成');
console.log(`📦 新版本: ${newVersion}`);
console.log(`🔧 构建号: ${buildNumber}`);
console.log(`🕒 更新时间: ${now.toISOString()}`);

// 更新HTML文件中的版本号
function updateHtmlFiles(version) {
    const htmlFiles = ['index.html', 'convo.html'];
    
    htmlFiles.forEach(fileName => {
        const filePath = path.join(__dirname, fileName);
        
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // 更新版本号（查找 vX.X.X 格式）
            const versionRegex = /v\d+\.\d+\.\d+/g;
            if (versionRegex.test(content)) {
                content = content.replace(versionRegex, `v${version}`);
                console.log(`✅ 更新 ${fileName} 版本号: v${version}`);
            } else {
                // 如果没有找到版本号，在合适的位置添加
                console.log(`⚠️  ${fileName} 中没有找到版本号，可能需要手动添加`);
            }
            
            fs.writeFileSync(filePath, content, 'utf8');
        } catch (error) {
            console.error(`更新 ${fileName} 失败:`, error);
        }
    });
}