// 主题管理功能
function initTheme() {
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        htmlElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            htmlElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

function toggleTheme() {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = isDark ?
        `<i class="fas fa-sun"></i>` :
        `<i class="fas fa-moon"></i>`;
}

// 添加滚动到顶部功能
function addScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--current-primary), var(--accent));
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(134, 93, 187, 0.3);
    `;

    document.body.appendChild(scrollBtn);

    // 滚动监听
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });

    // 点击滚动到顶部
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 悬停效果
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-3px) scale(1.1)';
    });

    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0) scale(1)';
    });
}

// 键盘导航支持
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC键回到顶部
        if (e.key === 'Escape') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // 空格键暂停/继续动画(如果有的话)
        if (e.key === ' ' && e.target === document.body) {
            e.preventDefault();
            // 可以在这里添加暂停动画的逻辑
        }
    });
}

// 初始化功能
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateThemeIcon();
    initKeyboardNavigation();
    initMobileMenu();

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // 滚动动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeIn 0.6s ease-out forwards`;
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animated').forEach(el => {
        observer.observe(el);
    });
});

// 移动菜单功能
function initMobileMenu() {
    // 创建汉堡菜单按钮
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-btn';
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    menuButton.style.cssText = `
        display: none;
        position: fixed;
        top: 15px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--current-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1001;
        box-shadow: 0 4px 15px rgba(134, 93, 187, 0.3);
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    `;
    
    // 添加到body
    document.body.appendChild(menuButton);
    
    // 检查窗口宽度并显示/隐藏汉堡菜单
    function checkScreenSize() {
        const navLinks = document.querySelector('.nav-links');
        const menuItems = document.querySelectorAll('.nav-links li:not(:last-child)');
        const themeToggle = document.getElementById('themeToggle');
        
        if (window.innerWidth <= 768) {
            // 移动设备：显示汉堡菜单，隐藏正常导航
            menuButton.style.display = 'flex';
            
            if (navLinks && themeToggle) {
                // 创建移动端导航容器
                let mobileNav = document.getElementById('mobile-nav');
                if (!mobileNav) {
                    mobileNav = document.createElement('div');
                    mobileNav.id = 'mobile-nav';
                    mobileNav.className = 'mobile-nav';
                    mobileNav.style.cssText = `
                        position: fixed;
                        top: 0;
                        right: -100%;
                        width: 280px;
                        height: 100vh;
                        background: var(--current-card-bg);
                        box-shadow: -5px 0 20px rgba(0, 0, 0, 0.15);
                        z-index: 1000;
                        transition: right 0.3s ease;
                        padding: 80px 20px 20px;
                        overflow-y: auto;
                    `;
                    
                    // 创建导航链接列表
                    const mobileNavList = document.createElement('ul');
                    mobileNavList.className = 'mobile-nav-list';
                    mobileNavList.style.cssText = `
                        list-style: none;
                        padding: 0;
                        margin: 0;
                    `;
                    
                    // 复制现有的导航链接
                    menuItems.forEach(item => {
                        const mobileItem = document.createElement('li');
                        mobileItem.style.cssText = `
                            margin-bottom: 15px;
                        `;
                        mobileItem.innerHTML = item.innerHTML;
                        mobileNavList.appendChild(mobileItem);
                    });
                    
                    mobileNav.appendChild(mobileNavList);
                    document.body.appendChild(mobileNav);
                }
            }
        } else {
            // 桌面设备：隐藏汉堡菜单
            menuButton.style.display = 'none';
            
            // 移除移动端导航容器
            const mobileNav = document.getElementById('mobile-nav');
            if (mobileNav) {
                mobileNav.style.right = '-100%';
            }
        }
    }
    
    // 初始检查
    checkScreenSize();
    
    // 窗口大小改变时检查
    window.addEventListener('resize', checkScreenSize);
    
    // 汉堡菜单点击事件
    menuButton.addEventListener('click', () => {
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav) {
            if (mobileNav.style.right === '0px') {
                mobileNav.style.right = '-100%';
                menuButton.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                mobileNav.style.right = '0';
                menuButton.innerHTML = '<i class="fas fa-times"></i>';
            }
        }
    });
    
    // 点击导航链接关闭菜单
    document.addEventListener('click', (e) => {
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav && mobileNav.style.right === '0px' && 
            !mobileNav.contains(e.target) && e.target !== menuButton && 
            !menuButton.contains(e.target)) {
            mobileNav.style.right = '-100%';
            menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// 页面加载完成后的初始化
window.addEventListener('load', () => {
    addScrollToTop();
});