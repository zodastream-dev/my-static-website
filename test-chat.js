// 测试聊天消息显示

// 1. 检查DOM元素是否存在
function checkDomElements() {
    console.log('🔍 检查DOM元素...');
    
    const elements = [
        'chat-messages',
        'main-input',
        'chat-list'
    ];
    
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            console.log(`✅ 找到元素: #${id}`);
            console.log(`   位置: ${el.getBoundingClientRect().top}px`);
            console.log(`   尺寸: ${el.offsetWidth}x${el.offsetHeight}`);
        } else {
            console.log(`❌ 未找到元素: #${id}`);
        }
    });
}

// 2. 模拟发送消息
function simulateSendMessage() {
    console.log('📤 模拟发送消息...');
    
    // 模拟用户消息
    const userMessage = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: '测试消息',
        timestamp: new Date().toISOString()
    };
    
    // 模拟AI回复
const assistantMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: '这是测试回复',
        timestamp: new Date().ISOString()
    };
    
    console.log('✅ 模拟消息创建完成');
    return [userMessage, assistantMessage];
}

// 3. 测试消息渲染
function testMessageRendering() {
    console.log('🎨 测试消息渲染...');
    
    // 获取消息容器
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) {
        console.log('❌ 找不到消息容器');
        return false;
    }
    
    console.log('✅ 找到消息容器');
    
    // 清空容器
    messagesContainer.innerHTML = '';
    console.log('🧹 清空消息容器');
    
    // 创建测试消息
    const testMessages = simulateSendMessage();
    
    // 渲染消息
    testMessages.forEach((message, index) => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.role}-message`;
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${message.content}</p>
            </div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        console.log(`✅ 渲染消息 ${index + 1}: ${message.content}`);
    });
    
    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    console.log('🎯 已滚动到底部');
    
    return true;
}

// 4. 运行所有测试
function runAllTests() {
    console.log('🚀 开始运行聊天消息显示测试...');
    
    console.log('📋 测试1: 检查DOM元素');
    checkDomElements();
    
    console.log('📋 测试2: 测试消息渲染');
    const result = testMessageRendering();
    
    if (result) {
        console.log('🎉 所有测试通过！');
        console.log('💡 建议：');
        console.log('   1. 确保.chat-messages有足够高度');
        console.log('   2. 检查CSS样式是否正确');
        console.log('   3. 验证JavaScript没有错误');
    } else {
        console.log('❌ 测试失败，请检查代码');
    }
}

// 页面加载后运行测试
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏁 DOM加载完成，开始测试...');
    
    // 等待页面完全加载
    setTimeout(() => {
        runAllTests();
    }, 500);
});

console.log('📄 测试脚本已加载');