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
    const scoreboardData = [
        { id: "Doctor01", team: "学军紫金港一队", time: "2025-08-24 14:00", status: "completed", score: 95 },
        { id: "ArknightsKing", team: "杭高钱江队", time: "2025-08-24 15:30", status: "in-progress", score: "-" },
        { id: "SilverAshFan", team: "杭二滨江队", time: "2025-08-24 16:15", status: "not-started", score: "-" },
    ];

    const statusMap = {
        "not-started": "未开赛",
        "in-progress": "比赛中",
        "completed": "已完赛"
    };

    const statusClassMap = {
        "not-started": "status-not-started",
        "in-progress": "status-in-progress",
        "completed": "status-completed"
    };

    function renderScoreboard(data) {
        const tbody = document.getElementById('scoreboard-body');
        if (!tbody) return;

        if (data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="no-results">
                        <i class="fas fa-search"></i> 没有找到匹配的选手记录
                    </td>
                </tr>
            `;
            return;
        }

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

    function initScoreboard() {
        if (!document.getElementById('scoreboard-body')) return;

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