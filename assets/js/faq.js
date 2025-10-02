// FAQ页面JavaScript功能

class FAQManager {
    constructor() {
        this.faqData = [];
        this.filteredData = [];
        this.searchTerm = '';

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
        let currentCategory = '通项';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // 检测主标题(分类)
            if (line.startsWith('# ')) {
                const title = line.substring(2).trim();
                if (title.includes('FAQs')) {
                    currentCategory = title.replace('FAQs', '').replace(/[()()]/g, '').trim() || '通项';
                }
                continue;
            }

            // 检测问题(二级标题)
            if (line.startsWith('## ')) {
                // 保存上一个问题
                if (currentQuestion) {
                    this.faqData.push({
                        question: currentQuestion,
                        answer: currentAnswer.join('\n').trim(),
                        category: currentCategory,
                        id: this.generateId(currentQuestion)
                    });
                }

                // 开始新问题
                currentQuestion = line.substring(3).trim();
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
                id: this.generateId(currentQuestion)
            });
        }

        this.filteredData = [...this.faqData];
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
            <div class="faq-item" data-category="${faq.category}">
                <button class="faq-question" data-id="${faq.id}">
                    <span>${this.highlightSearchTerm(faq.question)}</span>
                    <i class="fas fa-chevron-down faq-toggle"></i>
                </button>
                <div class="faq-answer" id="answer-${faq.id}">
                    <div class="faq-answer-content">
                        <div class="faq-category-tag">${faq.category}</div>
                        ${this.formatAnswer(faq.answer)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    formatAnswer(answer) {
        // 将Markdown格式转换为HTML
        let html = answer;
        
        // 处理加粗文本 - 确保只匹配完整的**对
        html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
        
        // 处理链接
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
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

            return matchesSearch;
        });

        this.renderFAQs();
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