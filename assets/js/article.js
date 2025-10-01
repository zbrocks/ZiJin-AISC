// 文章模版页面交互功能
document.addEventListener('DOMContentLoaded', function () {
    // 初始化页面动画
    initPageAnimations();
    
    // 初始化阅读进度条
    initReadingProgress();
    
    // 初始化文章交互功能
    initArticleInteractions();
    
    // 初始化分享功能
    initShareFeature();
    
    // 初始化收藏功能
    initBookmarkFeature();
    
    // 初始化滚动效果
    initScrollEffects();
});

// 页面加载动画
function initPageAnimations() {
    const elements = document.querySelectorAll('.breadcrumb, .article-content, .content-section, .principle-card, .moment-card, .plan-item');
    
    // 使用 Intersection Observer 实现滚动动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
}

// 阅读进度条
function initReadingProgress() {
    // 创建进度条元素
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.progress-fill');
    const articleBody = document.querySelector('.article-body');
    
    if (articleBody) {
        window.addEventListener('scroll', () => {
            const articleTop = articleBody.offsetTop;
            const articleHeight = articleBody.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;
            
            const start = articleTop - windowHeight / 2;
            const end = articleTop + articleHeight - windowHeight / 2;
            
            if (scrollTop >= start && scrollTop <= end) {
                const progress = (scrollTop - start) / (end - start);
                progressFill.style.width = Math.min(progress * 100, 100) + '%';
            } else if (scrollTop < start) {
                progressFill.style.width = '0%';
            } else {
                progressFill.style.width = '100%';
            }
        });
    }
}

// 文章交互功能
function initArticleInteractions() {
    // 为时间线事件添加点击展开功能
    const timelineEvents = document.querySelectorAll('.timeline-event');
    timelineEvents.forEach(event => {
        event.addEventListener('click', function() {
            this.classList.toggle('expanded');
            
            // 添加展开动画
            const content = this.querySelector('.event-content');
            if (this.classList.contains('expanded')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '';
            }
        });
    });
    
    // 为理念卡片添加翻转效果
    const principleCards = document.querySelectorAll('.principle-card');
    principleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0)';
        });
    });
    
    // 为精彩瞬间卡片添加悬停效果
    const momentCards = document.querySelectorAll('.moment-card');
    momentCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, rgba(134, 93, 187, 0.1), rgba(134, 93, 187, 0.05))';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = '';
        });
    });
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
            }).then(() => {
                showNotification('分享成功！', 'success');
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
            icon: 'fas fa-link',
            action: () => {
                navigator.clipboard.writeText(url).then(() => {
                    showNotification('链接已复制到剪贴板', 'success');
                }).catch(() => {
                    // 备用复制方法
                    const textArea = document.createElement('textarea');
                    textArea.value = url;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showNotification('链接已复制到剪贴板', 'success');
                });
            }
        },
        {
            name: '微信分享',
            icon: 'fab fa-weixin',
            action: () => {
                showNotification('请复制链接后在微信中分享', 'info');
                navigator.clipboard.writeText(url);
            }
        },
        {
            name: 'QQ分享',
            icon: 'fab fa-qq',
            action: () => {
                const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
                window.open(qqUrl, '_blank');
            }
        },
        {
            name: '微博分享',
            icon: 'fab fa-weibo',
            action: () => {
                const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
                window.open(weiboUrl, '_blank');
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
                <h3><i class="fas fa-share-alt"></i> 分享文章</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="share-options">
                ${options.map(option => `
                    <button class="share-option" data-action="${option.name}">
                        <i class="${option.icon}"></i>
                        <span>${option.name}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加显示动画
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // 绑定事件
    modal.querySelector('.close-btn').addEventListener('click', () => {
        closeModal(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    options.forEach((option, index) => {
        modal.querySelector(`[data-action="${option.name}"]`).addEventListener('click', () => {
            option.action();
            closeModal(modal);
        });
    });
}

// 关闭模态框
function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }, 300);
}

// 添加页面加载完成后的初始化
window.addEventListener('load', () => {
    // 添加页面加载完成的淡入效果
    document.body.style.opacity = '1';
    
    // 初始化文章目录（如果需要）
    generateTableOfContents();
});

// 生成文章目录
function generateTableOfContents() {
    const headings = document.querySelectorAll('.content-section h2');
    if (headings.length > 3) {
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = `
            <h4><i class="fas fa-list"></i> 文章目录</h4>
            <ul>
                ${Array.from(headings).map((heading, index) => {
                    const id = `section-${index}`;
                    heading.id = id;
                    return `<li><a href="#${id}">${heading.textContent}</a></li>`;
                }).join('')}
            </ul>
        `;
        
        // 插入到文章介绍后面
        const articleIntro = document.querySelector('.article-intro');
        if (articleIntro) {
            articleIntro.parentNode.insertBefore(toc, articleIntro.nextSibling);
        }
        
        // 添加平滑滚动
        toc.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// 为页面添加初始透明度
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// 添加样式
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: rgba(134, 93, 187, 0.1);
        z-index: 1000;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--current-primary), var(--accent));
        width: 0%;
        transition: width 0.3s ease;
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
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .share-modal.show {
        opacity: 1;
    }
    
    .share-modal-content {
        background: var(--current-card-bg);
        border-radius: 15px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transform: translateY(20px);
        transition: transform 0.3s ease;
    }
    
    .share-modal.show .share-modal-content {
        transform: translateY(0);
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
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .close-btn {
        background: none;
        border: none;
        font-size: 1.5em;
        cursor: pointer;
        color: var(--current-text-secondary);
        transition: color 0.3s ease;
    }
    
    .close-btn:hover {
        color: var(--current-primary);
    }
    
    .share-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
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
        text-align: left;
    }
    
    .share-option:hover {
        background: rgba(134, 93, 187, 0.2);
        transform: translateY(-2px);
    }
    
    .share-option i {
        color: var(--current-primary);
        width: 20px;
        text-align: center;
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
        max-width: 300px;
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
    
    .notification-close {
        background: none;
        border: none;
        color: var(--current-text-secondary);
        cursor: pointer;
        font-size: 1.2em;
        margin-left: auto;
    }
    
    .btn-secondary.bookmarked {
        background: var(--current-primary);
        color: white;
    }
    
    .table-of-contents {
        background: rgba(134, 93, 187, 0.05);
        border-radius: 12px;
        padding: 20px;
        margin: 30px 0;
        border-left: 4px solid var(--current-primary);
    }
    
    .table-of-contents h4 {
        color: var(--current-primary);
        margin: 0 0 15px 0;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .table-of-contents ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .table-of-contents li {
        margin-bottom: 8px;
    }
    
    .table-of-contents a {
        color: var(--current-text-secondary);
        text-decoration: none;
        transition: color 0.3s ease;
        display: block;
        padding: 5px 0;
    }
    
    .table-of-contents a:hover {
        color: var(--current-primary);
    }
    
    .timeline-event.expanded .event-content {
        background: rgba(134, 93, 187, 0.1);
    }
    
    header {
        transition: transform 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .share-options {
            grid-template-columns: 1fr;
        }
        
        .notification {
            right: 10px;
            left: 10px;
            transform: translateY(-100px);
            max-width: none;
        }
        
        .notification.show {
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(additionalStyles);

// 添加触摸设备支持
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', () => {
        // 为触摸设备优化交互
        const interactiveElements = document.querySelectorAll('.principle-card, .moment-card, .plan-item');
        interactiveElements.forEach(element => {
            element.style.cursor = 'pointer';
        });
    });
}