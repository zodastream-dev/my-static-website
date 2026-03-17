// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    console.log('静态网站已加载！');
    
    // 初始化所有功能
    initNavigation();
    initVisitorCounter();
    initUptimeCounter();
    initFormHandler();
    initAnimations();
    updateDeploymentLinks();
    updateLastUpdateDate();
});

// 导航栏功能
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // 点击导航链接时关闭移动菜单
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }
    
    // 滚动时高亮当前部分
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// 访问计数器
function initVisitorCounter() {
    const visitorCountElement = document.getElementById('visitor-count');
    if (!visitorCountElement) return;
    
    // 尝试从localStorage获取访问次数
    let visitorCount = localStorage.getItem('visitorCount');
    
    if (!visitorCount) {
        // 初始值，模拟一些访问量
        visitorCount = Math.floor(Math.random() * 100) + 50;
        localStorage.setItem('visitorCount', visitorCount.toString());
    } else {
        // 每次访问增加1
        visitorCount = parseInt(visitorCount) + 1;
        localStorage.setItem('visitorCount', visitorCount.toString());
    }
    
    // 动画显示数字
    animateCounter(visitorCountElement, visitorCount, 1000);
}

// 运行时间计数器
function initUptimeCounter() {
    const uptimeElement = document.getElementById('uptime-days');
    if (!uptimeElement) return;
    
    // 项目开始日期（今天）
    const startDate = new Date('2026-03-18');
    const today = new Date();
    
    // 计算天数差
    const timeDiff = today.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // 确保至少显示1天
    const uptimeDays = Math.max(1, daysDiff);
    
    // 动画显示数字
    animateCounter(uptimeElement, uptimeDays, 1500);
}

// 数字动画效果
function animateCounter(element, target, duration) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// 表单处理
function initFormHandler() {
    const messageForm = document.getElementById('message-form');
    if (!messageForm) return;
    
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // 简单的表单验证
        if (!name || !email || !message) {
            showNotification('请填写所有字段！', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('请输入有效的邮箱地址！', 'error');
            return;
        }
        
        // 模拟发送消息（实际项目中应该发送到服务器）
        console.log('消息已发送:', { name, email, message });
        
        // 显示成功消息
        showNotification('消息发送成功！感谢你的反馈。', 'success');
        
        // 重置表单
        this.reset();
    });
}

// 邮箱验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    
    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 初始化动画效果
function initAnimations() {
    // 使用Intersection Observer实现滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    document.querySelectorAll('.about-card, .step, .feature-item, .stat-card').forEach(el => {
        observer.observe(el);
    });
}

// 更新部署链接
function updateDeploymentLinks() {
    // 这些链接将在部署后更新
    const liveSiteLink = document.getElementById('live-site-link');
    const githubRepoLink = document.getElementById('github-repo-link');
    
    if (liveSiteLink) {
        // 部署后更新为实际链接
        liveSiteLink.href = '#';
        liveSiteLink.title = '部署后更新为实际链接';
    }
    
    if (githubRepoLink) {
        // 部署后更新为实际GitHub仓库链接
        githubRepoLink.href = '#';
        githubRepoLink.title = '部署后更新为实际GitHub仓库';
    }
}

// 更新最后更新日期
function updateLastUpdateDate() {
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        lastUpdateElement.textContent = formattedDate;
    }
}

// 添加一些额外的交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 代码预览区域的语法高亮效果
    const codePreview = document.querySelector('.code-preview code');
    if (codePreview) {
        // 简单的语法高亮
        const code = codePreview.textContent;
        const highlighted = code
            .replace(/&lt;/g, '<span class="html-tag">&lt;')
            .replace(/&gt;/g, '&gt;</span>')
            .replace(/html|head|title|body/g, '<span class="html-element">$&</span>')
            .replace(/Hello World!/g, '<span class="html-text">$&</span>');
        
        codePreview.innerHTML = highlighted;
        
        // 添加复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制代码';
        copyButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: #2563eb;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        copyButton.addEventListener('click', function() {
            navigator.clipboard.writeText(code)
                .then(() => {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> 已复制！';
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('复制失败:', err);
                });
        });
        
        codePreview.parentElement.style.position = 'relative';
        codePreview.parentElement.appendChild(copyButton);
    }
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        // Ctrl + / 显示帮助
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            showNotification('快捷键: Ctrl+/ 显示帮助 | Esc 关闭菜单', 'info');
        }
        
        // Esc 键关闭菜单
        if (e.key === 'Escape') {
            const navLinks = document.querySelector('.nav-links');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
    
    // 添加页面加载进度条
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #2563eb, #7c3aed);
        z-index: 9999;
        transition: width 0.3s;
    `;
    document.body.appendChild(progressBar);
    
    // 模拟加载进度
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                progressBar.style.opacity = '0';
                setTimeout(() => {
                    if (progressBar.parentNode) {
                        progressBar.parentNode.removeChild(progressBar);
                    }
                }, 300);
            }, 500);
        }
        progressBar.style.width = progress + '%';
    }, 100);
});

// 添加一些CSS类用于语法高亮
const highlightStyle = document.createElement('style');
highlightStyle.textContent = `
    .html-tag {
        color: #f87171;
    }
    .html-element {
        color: #60a5fa;
    }
    .html-text {
        color: #34d399;
    }
    .copy-button:hover {
        background: #1d4ed8;
        transform: translateY(-1px);
    }
`;
document.head.appendChild(highlightStyle);