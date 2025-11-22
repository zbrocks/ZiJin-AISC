/**
 * 公告页面JavaScript - 负责加载和渲染公告内容
 */

// DOM元素引用
const announcementsFeed = document.getElementById('announcementsFeed');

/**
 * 初始化公告页面
 */
async function initAnnouncements() {
    try {
        // 加载公告数据
        const announcements = await loadAnnouncements();
        
        // 渲染公告列表
        renderAnnouncements(announcements);
    } catch (error) {
        console.error('加载公告失败:', error);
        showErrorState();
    }
}

/**
 * 从JSON文件加载公告数据
 * @returns {Promise<Array>} 公告数据数组
 */
async function loadAnnouncements() {
    try {
        // 尝试从JSON文件加载数据
        const response = await fetch('../assets/json/announcements.json');
        
        if (!response.ok) {
            throw new Error('网络响应错误');
        }
        
        const data = await response.json();
        return data.announcements || [];
    } catch (error) {
        console.warn('无法从JSON文件加载数据，使用模拟数据:', error);
        // 如果无法加载JSON文件，返回模拟数据
        return "";
    }
}

/**
 * 渲染公告列表到页面
 * @param {Array} announcements 公告数据数组
 */
function renderAnnouncements(announcements) {
    // 清空加载状态
    announcementsFeed.innerHTML = '';
    
    // 检查是否有公告数据
    if (!announcements || announcements.length === 0) {
        showEmptyState();
        return;
    }
    
    // 按时间降序排序（最新的在前）
    const sortedAnnouncements = [...announcements].sort((a, b) => 
        new Date(b.publishTime) - new Date(a.publishTime)
    );
    
    // 创建并添加每个公告卡片
    sortedAnnouncements.forEach((announcement, index) => {
        const card = createAnnouncementCard(announcement, index);
        announcementsFeed.appendChild(card);
        
        // 添加简单的延迟效果，创造逐个加载的视觉体验
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

/**
 * 创建单个公告卡片元素
 * @param {Object} announcement 公告数据
 * @param {number} index 公告索引
 * @returns {HTMLElement} 公告卡片DOM元素
 */
function createAnnouncementCard(announcement, index) {
    const card = document.createElement('div');
    card.className = 'announcement-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transitionDelay = `${index * 0.1}s`;
    
    // 获取发布者头像首字母
    const avatarLetter = announcement.publisher.name.charAt(0).toUpperCase();
    
    // 格式化发布时间
    const formattedTime = formatPublishTime(announcement.publishTime);
    
    // 构建公告卡片HTML
    card.innerHTML = `
        <div class="announcement-header">
            <div class="publisher-avatar">${avatarLetter}</div>
            <div class="publisher-info">
                <span class="publisher-name">${announcement.publisher.name}</span>
                <div class="publish-time">
                    <i class="far fa-clock"></i>
                    ${formattedTime}
                </div>
            </div>
        </div>
        <div class="announcement-content">
            ${formatContent(announcement.content)}
        </div>
        <div class="announcement-footer">
            <div class="announcement-tags">
                ${announcement.tags.map(tag => 
                    `<span class="announcement-tag">${tag}</span>`
                ).join('')}
            </div>
        </div>
    `;
    
    return card;
}

/**
 * 格式化发布时间，使其更友好
 * @param {string} timeStr ISO格式的时间字符串
 * @returns {string} 格式化后的时间字符串
 */
function formatPublishTime(timeStr) {
    const now = new Date();
    const publishTime = new Date(timeStr);
    const diffMs = now - publishTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) {
        return '刚刚';
    } else if (diffMins < 60) {
        return `${diffMins}分钟前`;
    } else if (diffHours < 24) {
        return `${diffHours}小时前`;
    } else if (diffDays < 7) {
        return `${diffDays}天前`;
    } else {
        // 超过一周显示具体日期
        const result = timeStr.split('T')[0];
        return result;
    }
}

/**
 * 格式化公告内容，将换行符转换为段落
 * @param {string} content 公告文本内容
 * @returns {string} HTML格式的内容
 */
function formatContent(content) {
    // 将换行符分割成段落
    const paragraphs = content.split('\n').filter(p => p.trim() !== '');
    
    // 转换为HTML段落
    return paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
}

/**
 * HTML转义函数，防止XSS攻击
 * @param {string} text 要转义的文本
 * @returns {string} 转义后的文本
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 显示错误状态
 */
function showErrorState() {
    announcementsFeed.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-circle"></i>
            <h3>加载失败</h3>
            <p>无法加载公告内容，请稍后再试</p>
        </div>
    `;
}

/**
 * 显示空状态（无公告）
 */
function showEmptyState() {
    announcementsFeed.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-bullhorn"></i>
            <h3>暂无公告</h3>
            <p>目前还没有发布任何公告，请稍后再来查看</p>
        </div>
    `;
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnnouncements);
} else {
    initAnnouncements();
}