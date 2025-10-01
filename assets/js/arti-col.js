// 赛事通讯页面交互功能
document.addEventListener('DOMContentLoaded', function () {
    // 初始化页面动画
    initPageAnimations();
    
    // 初始化统计数字动画
    initCounterAnimations();
    
    // 初始化卡片悬停效果
    initCardHoverEffects();
    
    // 初始化时间线动画
    initTimelineAnimations();
    
    // 初始化订阅功能
    initSubscriptionFeature();
    
    // 初始化分享功能
    initShareFeature();
});

// 页面加载动画
function initPageAnimations() {
    const elements = document.querySelectorAll('.page-header, .stat-card, .article-card, .timeline-item, .subscription-card');
    
    // 使用 Intersection Observer 实现滚动动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

// 统计数字动画
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, '')) || 0;
        const increment = Math.max(target / 50, 1);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = counter.textContent.replace(/\d+/, target);
                clearInterval(timer);
            } else {
                counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
            }
        }, 30);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// 卡片悬停效果增强
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.article-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('placeholder')) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // 为特色文章添加特殊效果
        if (card.classList.contains('featured')) {
            card.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 20px 50px rgba(255, 215, 0, 0.3)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.boxShadow = '';
            });
        }
    });
}

// 时间线动画
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // 为时间线内容添加动画
                const content = entry.target.querySelector('.timeline-content');
                const marker = entry.target.querySelector('.timeline-marker');
                
                setTimeout(() => {
                    marker.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        marker.style.transform = 'scale(1)';
                    }, 200);
                }, 300);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// 订阅功能
function initSubscriptionFeature() {
    const subscriptionForm = document.querySelector('.subscription-form');
    const emailInput = document.querySelector('.email-input');
    const subscribeBtn = subscriptionForm?.querySelector('.btn-primary');
    
    if (subscriptionForm && emailInput && subscribeBtn) {
        subscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSubscription();
        });
        
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSubscription();
        });
        
        // 邮箱输入验证
        emailInput.addEventListener('input', function() {
            const email = this.value;
            const isValid = validateEmail(email);
            
            if (email && !isValid) {
                this.style.borderColor = '#f44336';
                this.style.boxShadow = '0 0 5px rgba(244, 67, 54, 0.3)';
            } else {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });
    }
}

// 处理订阅
function handleSubscription() {
    const emailInput = document.querySelector('.email-input');
    const subscribeBtn = document.querySelector('.subscription-form .btn-primary');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('请输入邮箱地址', 'warning');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('请输入有效的邮箱地址', 'error');
        return;
    }
    
    // 模拟订阅过程
    subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 订阅中...';
    subscribeBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('订阅成功！感谢您的关注', 'success');
        emailInput.value = '';
        subscribeBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 订阅';
        subscribeBtn.disabled = false;
        
        // 添加成功动画
        const subscriptionCard = document.querySelector('.subscription-card');
        subscriptionCard.style.transform = 'scale(1.05)';
        setTimeout(() => {
            subscriptionCard.style.transform = 'scale(1)';
        }, 200);
    }, 2000);
}

// 邮箱验证
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 分享功能
function initShareFeature() {
    window.shareArticle = function(title) {
        const url = window.location.href;
        const text = `推荐阅读：${title}`;
        
        if (navigator.share) {
            // 使用原生分享API
            navigator.share({
                title: title,
                text: text,
                url: url
            }).catch(err => {
                console.log('分享失败:', err);
                fallbackShare(title, url);
            });
        } else {
            fallbackShare(title, url);
        }
    };
}

// 备用分享方法
function fallbackShare(title, url) {
    const shareOptions = [
        {
            name: '复制链接',
            action: () => {
                navigator.clipboard.writeText(url).then(() => {
                    showNotification('链接已复制到剪贴板', 'success');
                }).catch(() => {
                    showNotification('复制失败，请手动复制', 'error');
                });
            }
        },
        {
            name: '微信分享',
            action: () => {
                showNotification('请复制链接后在微信中分享', 'info');
                navigator.clipboard.writeText(url);
            }
        },
        {
            name: 'QQ分享',
            action: () => {
                const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
                window.open(qqUrl, '_blank');
            }
        }
    ];
    
    showShareModal(shareOptions);
}

// 显示分享模态框
function showShareModal(options) {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-content">
            <div class="share-modal-header">
                <h3>分享文章</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="share-options">
                ${options.map(option => `
                    <button class="share-option" data-action="${option.name}">
                        <i class="fas fa-share-alt"></i>
                        ${option.name}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 绑定事件
    modal.querySelector('.close-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    options.forEach((option, index) => {
        modal.querySelector(`[data-action="${option.name}"]`).addEventListener('click', () => {
            option.action();
            document.body.removeChild(modal);
        });
    });
}

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 获取通知图标
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// 添加页面加载完成后的初始化
window.addEventListener('load', () => {
    // 添加页面加载完成的淡入效果
    document.body.style.opacity = '1';
});

// 为页面添加初始透明度
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// 添加样式
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .timeline-item.animate-in .timeline-content {
        animation: slideInContent 0.6s ease forwards;
    }
    
    @keyframes slideInContent {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .timeline-item:nth-child(even).animate-in .timeline-content {
        animation: slideInContentReverse 0.6s ease forwards;
    }
    
    @keyframes slideInContentReverse {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .share-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .share-modal-content {
        background: var(--current-card-bg);
        border-radius: 15px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .share-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .share-modal-header h3 {
        margin: 0;
        color: var(--current-primary);
    }
    
    .close-btn {
        background: none;
        border: none;
        font-size: 1.5em;
        cursor: pointer;
        color: var(--current-text-secondary);
    }
    
    .share-options {
        display: grid;
        gap: 10px;
    }
    
    .share-option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px;
        background: rgba(134, 93, 187, 0.1);
        border: none;
        border-radius: 10px;
        cursor: pointer;
        color: var(--current-text);
        transition: all 0.3s ease;
    }
    
    .share-option:hover {
        background: rgba(134, 93, 187, 0.2);
        transform: translateY(-2px);
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--current-card-bg);
        border-radius: 10px;
        padding: 15px 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        transform: translateX(400px);
        transition: all 0.3s ease;
        z-index: 1001;
        border-left: 4px solid;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left-color: #4CAF50;
    }
    
    .notification-error {
        border-left-color: #f44336;
    }
    
    .notification-warning {
        border-left-color: #FFC107;
    }
    
    .notification-info {
        border-left-color: var(--current-primary);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--current-text);
    }
    
    .notification-success .notification-content i {
        color: #4CAF50;
    }
    
    .notification-error .notification-content i {
        color: #f44336;
    }
    
    .notification-warning .notification-content i {
        color: #FFC107;
    }
    
    .notification-info .notification-content i {
        color: var(--current-primary);
    }
`;

document.head.appendChild(additionalStyles);

// 添加触摸设备支持
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', () => {
        // 为触摸设备优化交互
        const cards = document.querySelectorAll('.article-card, .stat-card');
        cards.forEach(card => {
            card.style.cursor = 'pointer';
        });
    });
}