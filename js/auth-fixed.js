/**
 * 用户认证系统 - 修复版本
 * 修复了按钮显示和事件绑定问题
 */

class AuthSystem {
    constructor() {
        this.usersKey = 'openclaw_users';
        this.currentUserKey = 'openclaw_current_user';
        this.init();
    }

    init() {
        // 初始化用户数据库
        if (!this.getUsers()) {
            this.setUsers([]);
        }
        
        // 检查当前登录状态
        this.updateUI();
        
        // 绑定事件
        this.bindEvents();
        
        console.log('✅ 认证系统初始化完成');
    }

    // 用户数据库操作
    getUsers() {
        const users = localStorage.getItem(this.usersKey);
        return users ? JSON.parse(users) : null;
    }

    setUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    getUser(username) {
        const users = this.getUsers();
        return users ? users.find(u => u.username === username) : null;
    }

    addUser(user) {
        const users = this.getUsers();
        users.push(user);
        this.setUsers(users);
    }

    // 当前用户操作
    getCurrentUser() {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    }

    setCurrentUser(user) {
        if (user) {
            localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        } else {
            localStorage.removeItem(this.currentUserKey);
        }
    }

    // 用户认证
    register(username, password) {
        // 验证用户名
        if (!this.validateUsername(username)) {
            return { success: false, message: '用户名只能包含字母和数字，长度3-20位' };
        }

        // 验证密码
        if (!this.validatePassword(password)) {
            return { success: false, message: '密码必须是8位字母和数字组合' };
        }

        // 检查用户是否存在
        if (this.getUser(username)) {
            return { success: false, message: '用户名已存在' };
        }

        // 创建新用户
        const user = {
            id: this.generateId(),
            username: username,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            lastLogin: null
        };

        // 保存用户
        this.addUser(user);
        
        // 自动登录
        this.setCurrentUser({
            id: user.id,
            username: user.username,
            createdAt: user.createdAt
        });

        return { success: true, message: '注册成功！' };
    }

    login(username, password) {
        // 获取用户
        const user = this.getUser(username);
        
        if (!user) {
            return { success: false, message: '用户名或密码错误' };
        }

        // 验证密码
        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: '用户名或密码错误' };
        }

        // 更新最后登录时间
        const users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].lastLogin = new Date().toISOString();
            this.setUsers(users);
        }

        // 设置当前用户（不保存密码）
        this.setCurrentUser({
            id: user.id,
            username: user.username,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        });

        return { success: true, message: '登录成功！' };
    }

    logout() {
        this.setCurrentUser(null);
        return { success: true, message: '已退出登录' };
    }

    // 验证函数
    validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
        return usernameRegex.test(username);
    }

    validatePassword(password) {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8}$/;
        return passwordRegex.test(password);
    }

    // 辅助函数
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    hashPassword(password) {
        // 简单哈希函数
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    // UI更新
    updateUI() {
        const currentUser = this.getCurrentUser();
        const authContainer = document.getElementById('auth-container');
        const userStatus = document.getElementById('user-status');
        
        if (!authContainer || !userStatus) {
            console.error('❌ UI元素未找到');
            return;
        }

        if (currentUser) {
            // 显示用户信息
            authContainer.style.display = 'none';
            userStatus.style.display = 'flex';
            
            // 更新用户信息
            const avatar = document.getElementById('user-avatar');
            const name = document.getElementById('user-name');
            
            if (avatar) {
                avatar.textContent = currentUser.username.charAt(0).toUpperCase();
            }
            
            if (name) {
                name.textContent = currentUser.username;
            }
            
            console.log('✅ 更新为登录状态:', currentUser.username);
        } else {
            // 显示登录/注册按钮
            authContainer.style.display = 'flex';
            userStatus.style.display = 'none';
            console.log('✅ 更新为未登录状态');
        }
    }

    // 事件绑定
    bindEvents() {
        console.log('🔧 开始绑定事件...');
        
        // 登录按钮
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                console.log('🖱️ 登录按钮被点击');
                this.showModal('login');
            });
            console.log('✅ 登录按钮事件绑定成功');
        } else {
            console.error('❌ 登录按钮未找到');
        }
        
        // 注册按钮
        const registerBtn = document.getElementById('register-btn');
        if (registerBtn) {
            registerBtn.addEventListener('click', () => {
                console.log('🖱️ 注册按钮被点击');
                this.showModal('register');
            });
            console.log('✅ 注册按钮事件绑定成功');
        } else {
            console.error('❌ 注册按钮未找到');
        }

        // 登出按钮
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                console.log('🖱️ 登出按钮被点击');
                this.logout();
                this.updateUI();
                this.showMessage('已成功退出登录', 'success');
            });
            console.log('✅ 登出按钮事件绑定成功');
        } else {
            console.error('❌ 登出按钮未找到');
        }

        // 模态框关闭
        const closeModal = document.getElementById('close-auth-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                console.log('🖱️ 关闭按钮被点击');
                this.hideModal();
            });
            console.log('✅ 关闭按钮事件绑定成功');
        } else {
            console.error('❌ 关闭按钮未找到');
        }

        // 标签切换
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        
        if (loginTab) {
            loginTab.addEventListener('click', () => {
                console.log('📑 切换到登录标签');
                this.switchTab('login');
            });
        }
        
        if (registerTab) {
            registerTab.addEventListener('click', () => {
                console.log('📑 切换到注册标签');
                this.switchTab('register');
            });
        }

        // 表单提交
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                console.log('📝 登录表单提交');
                this.handleLogin(e);
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                console.log('📝 注册表单提交');
                this.handleRegister(e);
            });
        }

        // 密码强度检查
        const registerPassword = document.getElementById('register-password');
        if (registerPassword) {
            registerPassword.addEventListener('input', () => {
                this.checkPasswordStrength();
            });
        }

        // 点击模态框外部关闭
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    console.log('🖱️ 点击模态框外部');
                    this.hideModal();
                }
            });
        }
        
        console.log('✅ 所有事件绑定完成');
    }

    // 模态框操作
    showModal(type = 'login') {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.add('active');
            this.switchTab(type);
            this.clearForms();
            console.log(`✅ 显示${type === 'login' ? '登录' : '注册'}模态框`);
        } else {
            console.error('❌ 模态框未找到');
        }
    }

    hideModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.classList.remove('active');
            this.clearForms();
            console.log('✅ 隐藏模态框');
        }
    }

    switchTab(type) {
        // 更新标签
        const loginTab = document.getElementById('login-tab');
        const registerTab = document.getElementById('register-tab');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (type === 'login') {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        } else {
            registerTab.classList.remove('active');
            loginTab.classList.remove('active');
            registerTab.classList.add('active');
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        }
    }

    // 表单处理
    handleLogin(e) {
        e.preventDefault();
        console.log('🔐 处理登录请求');
        
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        
        const result = this.login(username, password);
        
        if (result.success) {
            this.hideModal();
            this.updateUI();
            this.showMessage(result.message, 'success');
            console.log('✅ 登录成功:', username);
        } else {
            this.showFormError('login-form', result.message);
            console.log('❌ 登录失败:', result.message);
        }
    }

    handleRegister(e) {
        e.preventDefault();
        console.log('🔐 处理注册请求');
        
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // 验证确认密码
        if (password !== confirmPassword) {
            this.showFormError('register-form', '两次输入的密码不一致');
            console.log('❌ 密码不匹配');
            return;
        }
        
        const result = this.register(username, password);
        
        if (result.success) {
            this.hideModal();
            this.updateUI();
            this.showMessage(result.message, 'success');
            console.log('✅ 注册成功:', username);
        } else {
            this.showFormError('register-form', result.message);
            console.log('❌ 注册失败:', result.message);
        }
    }

    // 表单辅助函数
    clearForms() {
        // 清除表单数据
        const forms = ['login-form', 'register-form'];
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                form.reset();
                this.clearFormErrors(formId);
            }
        });
        
        // 清除密码强度指示器
        this.updatePasswordStrength(0);
    }

    clearFormErrors(formId) {
        const form = document.getElementById(formId);
        if (form) {
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(msg => {
                msg.classList.remove('show');
            });
            
            const inputs = form.querySelectorAll('.form-control');
            inputs.forEach(input => {
                input.classList.remove('error');
            });
        }
    }

    showFormError(formId, message) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        // 清除之前的错误
        this.clearFormErrors(formId);
        
        // 显示错误消息
        const errorDiv = form.querySelector('.form-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        }
    }

    // 密码强度检查
    checkPasswordStrength() {
        const password = document.getElementById('register-password').value;
        let strength = 0;
        
        // 长度检查
        if (password.length >= 4) strength += 25;
        if (password.length >= 6) strength += 25;
        
        // 复杂度检查
        if (/[a-zA-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 25;
        
        this.updatePasswordStrength(strength);
        this.updatePasswordRequirements(password);
    }

    updatePasswordStrength(strength) {
        const strengthBar = document.getElementById('password-strength-bar');
        const strengthText = document.getElementById('password-strength-text');
        
        if (!strengthBar || !strengthText) return;
        
        strengthBar.style.width = strength + '%';
        
        if (strength < 50) {
            strengthBar.style.backgroundColor = '#ef4444';
            strengthText.textContent = '弱';
            strengthText.style.color = '#ef4444';
        } else if (strength < 75) {
            strengthBar.style.backgroundColor = '#f59e0b';
            strengthText.textContent = '中';
            strengthText.style.color = '#f59e0b';
        } else {
            strengthBar.style.backgroundColor = '#10b981';
            strengthText.textContent = '强';
            strengthText.style.color = '#10b981';
        }
    }

    updatePasswordRequirements(password) {
        const requirements = document.querySelectorAll('.requirement');
        
        if (requirements.length === 0) return;
        
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasLength = password.length === 8;
        
        requirements[0].classList.toggle('valid', hasLetter);
        requirements[0].classList.toggle('invalid', !hasLetter);
        
        requirements[1].classList.toggle('valid', hasNumber);
        requirements[1].classList.toggle('invalid', !hasNumber);
        
        requirements[2].classList.toggle('valid', hasLength);
        requirements[2].classList.toggle('invalid', !hasLength);
    }

    // 消息显示
    showMessage(message, type = 'info') {
        const messageDiv = document.getElementById('auth-message');
        if (!messageDiv) return;
        
        messageDiv.textContent = message;
        messageDiv.className = `message ${type} show`;
        console.log(`💬 显示消息: ${message}`);
        
        // 3秒后自动隐藏
        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 3000);
    }
}

// 初始化认证系统
let authSystem;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM加载完成，初始化认证系统...');
    try {
        authSystem = new AuthSystem();
        
        // 添加欢迎消息
        showWelcomeMessage();
        console.log('🎉 认证系统初始化成功');
    } catch (error) {
        console.error('❌ 认证系统初始化失败:', error);
    }
});

// 显示欢迎消息
function showWelcomeMessage() {
    const currentUser = authSystem.getCurrentUser();
    if (currentUser) {
        setTimeout(() => {
            authSystem.showMessage(`欢迎回来，${currentUser.username}！`, 'success');
        }, 1000);
    }
}

// 全局导出（用于调试）
window.authSystem = authSystem;