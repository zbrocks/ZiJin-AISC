// FAQ页面JavaScript功能

class FAQManager {
    constructor() {
        this.faqData = [];
        this.filteredData = [];
        this.searchTerm = '';
        this.activeCategory = 'all';
        this.categories = {};

        this.init();
    }

    async init() {
        try {
            await this.loadFAQData();
            this.renderFAQs();
            this.bindEvents();
            this.hideLoading();
        } catch (error) {
            console.error('初始化FAQ失败:', error);
            this.showError();
        }
    }

    async loadFAQData() {
        try {
            // 读取FAQs.md文件
            const response = await fetch('/assets/FAQs.md');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const markdown = await response.text();
            this.parseFAQMarkdown(markdown);
        } catch (error) {
            console.error('加载FAQ数据失败:', error);
            throw error;
        }
    }

    parseFAQMarkdown(markdown) {
        const lines = markdown.split('\n');
        let currentQuestion = null;
        let currentAnswer = [];
        let currentMainCategory = '';
        let currentSubCategory = '';
        let currentCategory = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // 检测主标题(网站标题)
            if (line.startsWith('# ')) {
                // 跳过主标题，不做分类处理
                continue;
            }

            // 检测二级标题(主分类)
            if (line.startsWith('## ')) {
                // 保存上一个问题
                if (currentQuestion) {
                    this.faqData.push({
                        question: currentQuestion,
                        answer: currentAnswer.join('\n').trim(),
                        category: currentCategory,
                        mainCategory: currentMainCategory,
                        subCategory: currentSubCategory,
                        id: this.generateId(currentQuestion)
                    });
                }

                currentMainCategory = line.substring(3).trim();
                currentCategory = currentMainCategory;
                currentQuestion = null;
                currentAnswer = [];
                continue;
            }

            // 检测三级标题(问题)
            if (line.startsWith('### ')) {
                // 保存上一个问题
                if (currentQuestion) {
                    this.faqData.push({
                        question: currentQuestion,
                        answer: currentAnswer.join('\n').trim(),
                        category: currentCategory,
                        mainCategory: currentMainCategory,
                        subCategory: currentSubCategory,
                        id: this.generateId(currentQuestion)
                    });
                }

                // 开始新问题
                currentQuestion = line.substring(4).trim();
                currentSubCategory = currentQuestion;
                currentCategory = `${currentMainCategory}-${currentSubCategory}`;
                currentAnswer = [];
                continue;
            }

            // 收集答案内容
            if (currentQuestion && line) {
                currentAnswer.push(line);
            }
        }

        // 保存最后一个问题
        if (currentQuestion) {
            this.faqData.push({
                question: currentQuestion,
                answer: currentAnswer.join('\n').trim(),
                category: currentCategory,
                mainCategory: currentMainCategory,
                subCategory: currentSubCategory,
                id: this.generateId(currentQuestion)
            });
        }

        // 整理分类数据
        this.organizeCategories();
        this.filteredData = [...this.faqData];
    }

    organizeCategories() {
        this.categories = {};
        
        this.faqData.forEach(faq => {
            if (!this.categories[faq.mainCategory]) {
                this.categories[faq.mainCategory] = {
                    name: faq.mainCategory,
                    count: 0,
                    subCategories: {}
                };
            }
            
            this.categories[faq.mainCategory].count++;
            
            if (!this.categories[faq.mainCategory].subCategories[faq.subCategory]) {
                this.categories[faq.mainCategory].subCategories[faq.subCategory] = {
                    name: faq.subCategory,
                    count: 0,
                    fullCategory: faq.category
                };
            }
            
            this.categories[faq.mainCategory].subCategories[faq.subCategory].count++;
        });
    }

    renderCategories() {
        const faqSidebar = document.querySelector('.faq-sidebar');
        if (!faqSidebar) return;
        
        // 检查是否已有分类容器，如果没有则创建
        let categoriesContainer = faqSidebar.querySelector('.faq-categories');
        if (!categoriesContainer) {
            categoriesContainer = document.createElement('div');
            categoriesContainer.className = 'faq-categories';
            faqSidebar.appendChild(categoriesContainer);
        }
        
        // 清空并添加标题
        categoriesContainer.innerHTML = `
            <h3><i class="fas fa-tags"></i> 问题分类</h3>
            <ul class="main-categories">
                <li>
                    <a href="#" data-category="all" class="category-link ${this.activeCategory === 'all' ? 'active' : ''}">
                        <i class="fas fa-layer-group"></i> 全部问题
                    </a>
                </li>
            </ul>
        `;
        
        const mainCategoriesList = categoriesContainer.querySelector('.main-categories');
        
        // 添加主分类和子分类
        Object.keys(this.categories).forEach(mainCatName => {
            const mainCategory = this.categories[mainCatName];
            
            // 创建主分类项
            const mainLi = document.createElement('li');
            mainLi.className = 'main-category-item';
            mainLi.innerHTML = `
                <a href="#" data-category="${mainCatName}" class="category-link main-category-link ${this.activeCategory === mainCatName ? 'active' : ''}">
                    ${mainCatName}
                </a>
            `;
            
            mainCategoriesList.appendChild(mainLi);
            

        });

    }

    generateId(text) {
        // 添加时间戳和随机数确保ID唯一性
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const baseId = text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 30);
        return `${baseId}-${timestamp}-${random}`;
    }


    // 处理懒加载图片
    handleLazyImages() {
        const lazyImages = document.querySelectorAll('.lazy-image');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // 图片加载完成后添加loaded类以触发CSS过渡效果
                        img.onload = () => {
                            img.classList.add('loaded');
                        };
                        
                        // 对于已经加载完成的图片，立即添加loaded类
                        if (img.complete) {
                            img.classList.add('loaded');
                        }
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '0px 0px 200px 0px' // 提前200px触发加载
            });
            
            lazyImages.forEach(img => {
                observer.observe(img);
            });
        } else {
            // 降级处理：对于不支持IntersectionObserver的浏览器，直接加载所有图片
            lazyImages.forEach(img => {
                img.classList.add('loaded');
            });
        }
    }

    renderFAQs() {
        const faqList = document.getElementById('faqList');

        if (this.filteredData.length === 0) {
            faqList.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>没有找到匹配的问题,请尝试其他关键词.</p>
                </div>
            `;
            return;
        }

        faqList.innerHTML = this.filteredData.map(faq => `
            <div class="faq-item" data-category="${faq.category}" data-main-category="${faq.mainCategory}">
                <button class="faq-question" data-id="${faq.id}">
                    <span class="tag">${faq.mainCategory}</span>
                    <span class="faq-question-text">${this.highlightSearchTerm(faq.question)}</span>
                    <i class="fas fa-chevron-down faq-toggle"></i>
                </button>
                <div class="faq-answer" id="answer-${faq.id}">
                    <div class="faq-answer-content">
                        ${this.formatAnswer(faq.answer)}
                    </div>
                </div>
            </div>
        `).join('');
        
        // 渲染完成后处理懒加载图片
        this.handleLazyImages();
    }

    formatAnswer(answer) {
        // 将Markdown格式转换为HTML
        let html = answer;
        
        // 处理加粗文本 - 确保只匹配完整的**对
        html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
        
        // 处理链接
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // 处理图片并添加懒加载属性
        html = html.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" class="lazy-image" />');
        
        // 处理代码
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // 处理多级列表 - 先处理嵌套结构
        // 1. 识别并处理嵌套列表标记
        const lines = html.split('\n');
        let inOrderedList = false;
        let inUnorderedList = false;
        let processedLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            
            // 跳过空行
            if (line === '') {
                if (inOrderedList || inUnorderedList) {
                    // 列表中的空行结束当前列表
                    processedLines.push(inOrderedList ? '</ol>' : '</ul>');
                    inOrderedList = false;
                    inUnorderedList = false;
                }
                processedLines.push('');
                continue;
            }
            
            // 处理有序列表项
            if (/^\d+\.\s/.test(line)) {
                if (!inOrderedList && !inUnorderedList) {
                    processedLines.push('<ol>');
                    inOrderedList = true;
                } else if (inUnorderedList) {
                    processedLines.push('</ul>');
                    processedLines.push('<ol>');
                    inUnorderedList = false;
                    inOrderedList = true;
                }
                // 移除列表标记并添加列表项
                line = line.replace(/^\d+\.\s/, '');
                processedLines.push(`<li>${line}</li>`);
            }
            // 处理无序列表项
            else if (/^-\s/.test(line)) {
                if (!inUnorderedList && !inOrderedList) {
                    processedLines.push('<ul>');
                    inUnorderedList = true;
                } else if (inOrderedList) {
                    processedLines.push('</ol>');
                    processedLines.push('<ul>');
                    inOrderedList = false;
                    inUnorderedList = true;
                }
                // 移除列表标记并添加列表项
                line = line.replace(/^-\s/, '');
                processedLines.push(`<li>${line}</li>`);
            }
            // 处理嵌套列表项 (缩进的列表)
            else if (/^(\s{4,})-\s/.test(line) || /^(\s{4,})\d+\.\s/.test(line)) {
                const match = line.match(/^(\s{4,})/);
                const indentLevel = Math.floor(match[1].length / 4);
                const content = line.trim();
                
                if (/^-\s/.test(content)) {
                    const listItem = content.replace(/^-\s/, '');
                    processedLines.push(`<ul class="nested-list nested-level-${indentLevel}"><li>${listItem}</li></ul>`);
                } else if (/^\d+\.\s/.test(content)) {
                    const listItem = content.replace(/^\d+\.\s/, '');
                    processedLines.push(`<ol class="nested-list nested-level-${indentLevel}"><li>${listItem}</li></ol>`);
                }
            }
            // 普通段落内容
            else {
                if (inOrderedList || inUnorderedList) {
                    // 非列表项结束当前列表
                    processedLines.push(inOrderedList ? '</ol>' : '</ul>');
                    inOrderedList = false;
                    inUnorderedList = false;
                }
                processedLines.push(line);
            }
        }
        
        // 确保关闭所有打开的列表
        if (inOrderedList) {
            processedLines.push('</ol>');
        } else if (inUnorderedList) {
            processedLines.push('</ul>');
        }
        
        // 重新组合处理后的行
        html = processedLines.join('\n');
        
        // 处理段落和换行
        const paragraphs = html.split('\n\n');
        const formattedParagraphs = paragraphs.map(para => {
            // 如果段落已经包含HTML标签，不添加额外的p标签
            if (para.trim() === '' || para.match(/^<(ul|ol|li|table|blockquote|pre)/i)) {
                return para;
            }
            return `<p>${para}</p>`;
        });
        
        html = formattedParagraphs.join('\n\n');
        
        // 处理剩余的换行符（在段落内）
        html = html.replace(/\n(?!<\/?[a-z])/g, '<br>');
        
        return html;
    }

    highlightSearchTerm(text) {
        if (!this.searchTerm) return text;

        const regex = new RegExp(`(${this.escapeRegExp(this.searchTerm)})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    filterFAQs() {
        this.filteredData = this.faqData.filter(faq => {
            const matchesSearch = !this.searchTerm ||
                faq.question.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                faq.answer.toLowerCase().includes(this.searchTerm.toLowerCase());

            const matchesCategory = this.activeCategory === 'all' ||
                faq.category === this.activeCategory ||
                faq.mainCategory === this.activeCategory;

            return matchesSearch && matchesCategory;
        });

        this.renderFAQs();
    }

    setActiveCategory(category) {
        this.activeCategory = category;
        this.filterFAQs();
        
        // 更新分类链接的激活状态
        const categoryLinks = document.querySelectorAll('.category-link');
        categoryLinks.forEach(link => {
            if (link.dataset.category === category) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

    }

    bindEvents() {
        // 搜索功能
        const searchInput = document.getElementById('faqSearch');
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.trim();
            this.filterFAQs();
        });

        // FAQ展开/收起
        document.getElementById('faqList').addEventListener('click', (e) => {
            const button = e.target.closest('.faq-question');
            if (button) {
                const faqItem = button.closest('.faq-item');
                const answer = faqItem.querySelector('.faq-answer');

                if (!answer) {
                    console.error('找不到对应的答案元素');
                    return;
                }

                // 切换状态
                button.classList.toggle('active');
                answer.classList.toggle('active');

                // 滚动到问题位置
                if (button.classList.contains('active')) {
                    setTimeout(() => {
                        button.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest'
                        });
                    }, 100);
                }
            }
        });

        // 分类点击事件
        document.querySelector('.faq-sidebar').addEventListener('click', (e) => {
            const categoryLink = e.target.closest('.category-link');
            if (categoryLink) {
                e.preventDefault();
                const category = categoryLink.dataset.category;
                this.setActiveCategory(category);
                 
                // 平滑滚动到页面顶部
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + F 聚焦搜索框
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                searchInput.focus();
            }

            // ESC 清空搜索
            if (e.key === 'Escape' && document.activeElement === searchInput) {
                searchInput.value = '';
                this.searchTerm = '';
                this.filterFAQs();
            }
        });
    }

    hideLoading() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        const faqList = document.getElementById('faqList');

        loadingSpinner.style.display = 'none';
        faqList.style.display = 'block';
        
        // 渲染分类
        this.renderCategories();
    }

    showError() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        const errorMessage = document.getElementById('errorMessage');

        loadingSpinner.style.display = 'none';
        errorMessage.style.display = 'block';
    }
}

// 页面加载完成后初始化FAQ管理器
document.addEventListener('DOMContentLoaded', () => {
    new FAQManager();
});

// 导出供其他脚本使用
window.FAQManager = FAQManager;