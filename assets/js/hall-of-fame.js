// 选手数据
let playerData = {};

// 异步加载选手数据
async function loadPlayerData() {
    try {
        const response = await fetch('/assets/json/players.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        playerData = await response.json();
    } catch (error) {
        console.error('加载选手数据失败:', error);
    }
}

// DOM元素
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const smallCards = document.querySelectorAll('.small-card');

// 模态框内容元素
const modalAvatar = document.getElementById('modalAvatar')
const modalName = document.getElementById('modalName');
const modalTeam = document.getElementById('modalTeam');
const modalScore = document.getElementById('modalScore');
const modalEvent = document.getElementById('modalEvent');
const modalQuote = document.getElementById('modalQuote');

// 打开模态框
function openModal(playerId) {
    const player = playerData[playerId];
    if (player) {
        // 设置模态框中的头像
        const modalAvatar = document.getElementById('modalMemberAvatar');
        if (modalAvatar && player.avatar) {
            modalAvatar.src = player.avatar;
            modalAvatar.alt = player.name;
        }
        modalName.textContent = player.name;
        modalTeam.textContent = player.team;
        modalScore.textContent = player.score;
        modalEvent.textContent = player.event;
        modalQuote.textContent = player.quote;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // 先加载数据
    await loadPlayerData();
    
    document.querySelectorAll('.small-card').forEach(card => {
        const playerId = card.getAttribute('data-card-id');
        const player = playerData[playerId];
        const avatar = card.querySelector('.member-avatar');

        if (player && player.avatar && avatar) {
            avatar.dataset.src = player.avatar;
            avatar.alt = player.name;
        } else {
            avatar.style.display = 'none';
        }
        
        // 如果存在全局的懒加载观察函数，则使用它
        if (window.observeLazyImages) {
            window.observeLazyImages([avatar]);
        }
    });
});

// 关闭模态框
function closeModalHandler() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // 恢复背景滚动
}

// 事件监听
smallCards.forEach(card => {
    card.addEventListener('click', () => {
        const playerId = card.getAttribute('data-card-id');
        openModal(playerId);
    });
});

closeModal.addEventListener('click', closeModalHandler);

// 点击模态框背景也可关闭
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModalHandler();
    }
});

// ESC键关闭模态框
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModalHandler();
    }
});

