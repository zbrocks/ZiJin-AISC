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
        
        // 空格键暂停/继续动画（如果有的话）
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

// 页面加载完成后的初始化
window.addEventListener('load', () => {
    addScrollToTop();
});