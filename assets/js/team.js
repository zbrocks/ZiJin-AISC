// 团队成员数据
let memberData = {};

// 异步加载团队成员数据
async function loadMemberData() {
    try {
        const response = await fetch('/assets/json/team-members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        memberData = await response.json();
    } catch (error) {
        console.error('加载团队成员数据失败:', error);
    }
}

// DOM元素
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const smallCards = document.querySelectorAll('.small-card');

// 模态框内容元素
const modalAvatar = document.getElementById('modalAvatar')
const modalName = document.getElementById('modalName');
const modalRole = document.getElementById('modalRole');
const modalContact = document.getElementById('modalContact');
const modalEvent = document.getElementById('modalEvent');
// const modalQuote = document.getElementById('modalQuote');

// 打开模态框
function openModal(memberId) {
    const member = memberData[memberId];
    if (member) {
        // 设置模态框中的头像
        const modalAvatar = document.getElementById('modalMemberAvatar');
        if (modalAvatar && member.avatar) {
            modalAvatar.src = member.avatar;
            modalAvatar.alt = member.name;
        }
        modalName.textContent = member.name;
        modalRole.textContent = member.role;
        modalContact.textContent = member.contact;
        modalEvent.textContent = member.event;
        // modalQuote.textContent = member.quote;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
}

// 在DOMContentLoaded事件中添加
document.addEventListener('DOMContentLoaded', async () => {
    // 先加载数据
    await loadMemberData();
    
    // 设置小卡片头像
    document.querySelectorAll('.small-card').forEach(card => {
        const memberId = card.getAttribute('data-card-id');
        const member = memberData[memberId];
        const avatar = card.querySelector('.member-avatar');

        if (member && member.avatar && avatar) {
            avatar.src = member.avatar;
            avatar.alt = member.name;
        } else {
            // 保持渐变背景作为备用
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
        const memberId = card.getAttribute('data-card-id');
        openModal(memberId);
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