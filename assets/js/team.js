// 选手数据
const memberData = {
    T01: {
        name: "天堂支点",
        role: "策划",
        contact: "WeChat: amutou007",
        event: "紫金杯#2 紫金杯#3",
        // quote: "完美的战术布局和精准的操作时机是取胜的关键"
        avatar: "../assets/images/faces/team/天堂支点.jpg"
    },
    T02: {
        name: "雨落星辰",
        role: "美术&宣传",
        contact: "WeChat: YC131645",
        event: "紫金杯#2 紫金杯#3",
        // quote: "团队协作和资源分配是集成战略的核心"
        avatar: "../assets/images/faces/team/雨落星辰.jpg"
    },
    T03: {
        name: "你的洛",
        role: "策划",
        contact: "WeChat: c13738115025",
        event: "紫金杯#1 紫金杯#3",
        // quote: "灵活应变和快速决策能力在比赛中至关重要"
        avatar: "../assets/images/faces/team/你的洛.jpg"
    },
    T04: {
        name: "前航远歌",
        role: "干事",
        contact: "WeChat: cyl13757165256",
        event: "紫金杯#2 紫金杯#3",
        // quote: "每一次失败都是下一次成功的垫脚石"
        avatar: "../assets/images/faces/team/前航远歌.jpg"
    },
    T05: {
        name: "xXD",
        role: "计分&支持",
        contact: "WeChat: xXD66c",
        event: "紫金杯#2 紫金杯#3",
        // quote: "细节决定成败，在集成战略中尤为如此"
        avatar: "../assets/images/faces/team/xXD.jpg"
    },
    T06: {
        name: "乘槎一问津",
        role: "剪辑",
        contact: "WeChat: POSBL_1102",
        event: "紫金杯#3",
        // quote: "保持冷静的头脑才能在高压环境下做出正确判断"
        avatar: "../assets/images/faces/team/乘槎一问津.jpg"
    }
};

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
document.addEventListener('DOMContentLoaded', () => {
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

    // 设置模态框头像
    // const modalAvatar = document.getElementById('modalMemberAvatar');
    // if (modalAvatar) {
    //     modalAvatar.src = "";
    //     modalAvatar.alt = "";
    // }
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