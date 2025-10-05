// 规则集合页面交互功能
document.addEventListener('DOMContentLoaded', function () {
    // 初始化页面动画
    initPageAnimations();
    
    // 初始化统计数字动画
    initCounterAnimations();
    
    // 初始化卡片悬停效果
    initCardHoverEffects();
    
    // 初始化时间线动画
    initTimelineAnimations();
    
    // 初始化快速导航
    initQuickNavigation();
});

// 页面加载动画
function initPageAnimations() {
    const elements = document.querySelectorAll('.page-header, .stat-card, .rule-card, .timeline-item');
    
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
        const target = counter.textContent.replace(/[^\d]/g, ''); // 提取数字
        const increment = target / 50; // 动画步数
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
    const cards = document.querySelectorAll('.rule-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
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

// 快速导航功能
function initQuickNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 添加点击波纹效果
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 添加页面加载完成后的初始化
window.addEventListener('load', () => {
    // 添加页面加载完成的淡入效果
    document.body.style.opacity = '1';
});

// 为页面添加初始透明度
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// 添加波纹效果的CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-item {
        position: relative;
        overflow: hidden;
    }
    
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
`;

document.head.appendChild(rippleStyle);

// 添加触摸设备支持
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', () => {
        // 为触摸设备优化交互
        const cards = document.querySelectorAll('.rule-card, .stat-card');
        cards.forEach(card => {
            card.style.cursor = 'pointer';
        });
    });
}