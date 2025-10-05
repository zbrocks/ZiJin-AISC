document.addEventListener('DOMContentLoaded', () => {
    // 轮播图功能
    function initCarousel() {
        const items = document.querySelectorAll('.carousel-item');
        const indicators = document.querySelectorAll('.carousel-indicator');
        if (!items.length) return;

        let currentIndex = 0;
        let interval;

        function goToSlide(index) {
            items.forEach(item => item.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));

            items[index].classList.add('active');
            indicators[index].classList.add('active');
            currentIndex = index;
        }

        function nextSlide() {
            const newIndex = (currentIndex + 1) % items.length;
            goToSlide(newIndex);
        }

        function startAutoPlay() {
            interval = setInterval(nextSlide, 5000);
        }

        function stopAutoPlay() {
            clearInterval(interval);
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopAutoPlay();
                goToSlide(index);
                startAutoPlay();
            });
        });

        startAutoPlay();
    }

    // 计分板功能
    const scoreboardData = [];
    let statusMap = {};
    let statusClassMap = {};

    // 异步加载状态配置数据
    async function loadStatusConfig() {
        try {
            const response = await fetch('/assets/json/status-config.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const config = await response.json();
            statusMap = config.statusMap;
            statusClassMap = config.statusClassMap;
        } catch (error) {
            console.error('加载状态配置失败:', error);
        }
    }

    function renderScoreboard(data) {
        const tbody = document.getElementById('scoreboard-body');
        const mobileViewContainer = document.querySelector('.scoreboard-mobile-view');
        if (!tbody) return;

        // 确保移动视图容器存在
        if (!mobileViewContainer) {
            const container = document.createElement('div');
            container.className = 'scoreboard-mobile-view';
            tbody.parentNode.insertBefore(container, tbody.nextSibling);
        }

        if (data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="no-results">
                        <i class="fas fa-search"></i> 您期待的选手还在路上
                    </td>
                </tr>
            `;
            
            // 移动视图显示相同的空状态
            const mobileView = document.querySelector('.scoreboard-mobile-view');
            if (mobileView) {
                mobileView.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i> 您期待的选手还在路上
                    </div>
                `;
            }
            return;
        }

        // 桌面视图：表格显示
        tbody.innerHTML = data.map(player => `
            <tr>
                <td>${player.id}</td>
                <td>${player.team}</td>
                <td>${player.time}</td>
                <td>
                    <span class="status-badge ${statusClassMap[player.status]}">
                        ${statusMap[player.status]}
                    </span>
                </td>
                <td class="score-value">${player.score}</td>
            </tr>
        `).join('');

        // 移动视图：卡片式显示
        const mobileView = document.querySelector('.scoreboard-mobile-view');
        if (mobileView) {
            mobileView.innerHTML = data.map(player => `
                <div class="mobile-player-card">
                    <div class="mobile-player-row">
                        <span class="mobile-label">选手ID</span>
                        <span class="mobile-value">${player.id}</span>
                    </div>
                    <div class="mobile-player-row">
                        <span class="mobile-label">所属队伍</span>
                        <span class="mobile-value">${player.team}</span>
                    </div>
                    <div class="mobile-player-row">
                        <span class="mobile-label">比赛时间</span>
                        <span class="mobile-value">${player.time}</span>
                    </div>
                    <div class="mobile-player-row">
                        <span class="mobile-label">比赛状态</span>
                        <span class="mobile-value">
                            <span class="status-badge ${statusClassMap[player.status]}">
                                ${statusMap[player.status]}
                            </span>
                        </span>
                    </div>
                    <div class="mobile-player-row">
                        <span class="mobile-label">最终得分</span>
                        <span class="mobile-value score">${player.score}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    function filterScoreboard() {
        const statusFilter = document.getElementById('statusFilter')?.value || 'all';
        const playerFilter = document.getElementById('playerFilter')?.value.toLowerCase() || '';
        const teamFilter = document.getElementById('teamFilter')?.value.toLowerCase() || '';

        const filteredData = scoreboardData.filter(player => {
            if (statusFilter !== 'all' && player.status !== statusFilter) return false;
            if (playerFilter && !player.id.toLowerCase().includes(playerFilter)) return false;
            if (teamFilter && !player.team.toLowerCase().includes(teamFilter)) return false;
            return true;
        });

        renderScoreboard(filteredData);
    }

    let currentSort = { column: 'id', direction: 'asc' };

    function sortScoreboard(column) {
        if (currentSort.column === column) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort.column = column;
            currentSort.direction = 'asc';
        }

        document.querySelectorAll('.scoreboard-table th').forEach(th => {
            th.classList.remove('sorted-asc', 'sorted-desc');
        });

        const currentTh = document.querySelector(`.scoreboard-table th[data-sort="${currentSort.column}"]`);
        if (currentTh) {
            currentTh.classList.add(currentSort.direction === 'asc' ? 'sorted-asc' : 'sorted-desc');
        }

        const sortedData = [...scoreboardData].sort((a, b) => {
            let valueA = a[currentSort.column];
            let valueB = b[currentSort.column];

            if (currentSort.column === 'score') {
                valueA = a.score === '-' ? -1 : a.score;
                valueB = b.score === '-' ? -1 : b.score;
            }

            if (valueA < valueB) return currentSort.direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return currentSort.direction === 'asc' ? 1 : -1;
            return 0;
        });

        renderScoreboard(sortedData);
    }

    async function initScoreboard() {
        if (!document.getElementById('scoreboard-body')) return;

        // 先加载状态配置
        await loadStatusConfig();

        document.getElementById('statusFilter')?.addEventListener('change', filterScoreboard);
        document.getElementById('playerFilter')?.addEventListener('input', filterScoreboard);
        document.getElementById('teamFilter')?.addEventListener('input', filterScoreboard);

        document.querySelectorAll('.scoreboard-table th[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                const sortColumn = th.getAttribute('data-sort');
                sortScoreboard(sortColumn);
            });
        });

        renderScoreboard(scoreboardData);
    }

    // 初始化页面功能
    initCarousel();
    initScoreboard();
});