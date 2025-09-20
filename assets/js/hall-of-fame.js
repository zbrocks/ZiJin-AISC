// 选手数据
const playerData = {
    P01: {
        name: "Dialectic",
        team: "香澄蜜柑仙贝",
        score: "决赛唯一幸存",
        event: "紫金杯#2",
        quote: "我是奎隆好大儿",
        avatar: "../assets/images/faces/player/Dialectic.jpg"
    },
    P02: {
        name: "你的洛",
        team: "蓝图测绘分队",
        score: "初赛最高分",
        event: "紫金杯#2",
        quote: "他好像什么都没说...",
        avatar: "../assets/images/faces/player/你的洛.jpg"

    },
};

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

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.small-card').forEach(card => {
        const playerId = card.getAttribute('data-card-id');
        const player = playerData[playerId];
        const avatar = card.querySelector('.member-avatar');

        if (player && player.avatar && avatar) {
            avatar.src = player.avatar;
            avatar.alt = player.name;
        } else {
            avatar.style.display = 'none';
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

