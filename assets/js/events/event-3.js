// 比赛事件管理
class EventManager {
    constructor() {
        this.eventData = {
            "作业未完成": {
                "LuoYu": {
                    "name": "洛雨言",
                    "role": "神人",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "YiMeng": {
                    "name": "遗梦繁华",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "Msrys": {
                    "name": "Msrys",
                    "role": "创想家",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "ChenPi": {
                    "name": "陳皮糖",
                    "role": "深度坍缩者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                }
            },
            "精灵耳品鉴中心": {
                "ChangFeng": {
                    "name": "长风",
                    "role": "神人",
                    "avatar": "/assets/images/faces/player/雨落星辰.jpg"
                },
                "MaoMao": {
                    "name": "乘槎一问津",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/player/乘槎一问津.jpg"
                },
                "XianWei": {
                    "name": "Dialectic",
                    "role": "创想家",
                    "avatar": "/assets/images/faces/player/Dialectic.jpg"
                },
                "LZ": {
                    "name": "LZ",
                    "role": "深度坍缩者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                }
            },
            "沙阿会梦到弑君者吗": {
                "xXD": {
                    "name": "xXD",
                    "role": "神人",
                    "avatar": "/assets/images/faces/player/xXD.jpg"
                },
                "Natsuk": {
                    "name": "Natsuk",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "BaiWan": {
                    "name": "百万",
                    "role": "创想家",
                    "avatar": "/assets/images/faces/player/前航远歌.jpg"
                },
                "TianTang": {
                    "name": "天堂支点",
                    "role": "深度坍缩者",
                    "avatar": "/assets/images/faces/player/天堂支点.jpg"
                }
            },
            "蛰伏影中的猫": {
                "ChunFeng": {
                    "name": "纯风有宴",
                    "role": "神人",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "ZhongYe1": {
                    "name": "柊葉晴川",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "Zhongye2": {
                    "name": "柊葉晴川",
                    "role": "创想家",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "HaoYue": {
                    "name": "皓月当年",
                    "role": "深度坍缩者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                }
            },
        };
        this.modalOverlay = null;
        this.closeModal = null;
        this.init();
    }

    init() {
        this.initDOM();
        this.renderTeams();
        this.bindEvents();
    }

    // 初始化DOM元素
    initDOM() {
        this.modalOverlay = document.getElementById('modalOverlay');
        this.closeModal = document.getElementById('closeModal');
        this.teamsContainer = document.getElementById('teams-container');
    }

    // 渲染所有队伍
    renderTeams() {
        if (!this.teamsContainer || !this.eventData) return;

        this.teamsContainer.innerHTML = '';

        Object.keys(this.eventData).forEach(teamName => {
            const teamSection = this.createTeamSection(teamName, this.eventData[teamName]);
            this.teamsContainer.appendChild(teamSection);
        });
    }

    // 创建队伍区域
    createTeamSection(teamName, players) {
        const teamSection = document.createElement('div');
        teamSection.className = 'team-section';

        const teamHeader = document.createElement('div');
        teamHeader.className = 'team-header';
        teamHeader.innerHTML = `
            <i class="fas fa-users"></i>
            <h3>${teamName}</h3>
        `;

        const teamPlayers = document.createElement('div');
        teamPlayers.className = 'team-players';

        Object.keys(players).forEach(playerKey => {
            const player = players[playerKey];
            const playerCard = this.createPlayerCard(player, teamName);
            teamPlayers.appendChild(playerCard);
        });

        teamSection.appendChild(teamHeader);
        teamSection.appendChild(teamPlayers);

        return teamSection;
    }

    // 创建选手卡片
    createPlayerCard(player, teamName) {
        const card = document.createElement('div');
        card.className = 'small-card';
        card.setAttribute('data-player-name', player.name);
        card.setAttribute('data-team-name', teamName);
        card.setAttribute('data-player-role', player.role);

        // 设置默认头像路径
        const avatarSrc = player.avatar || this.getDefaultAvatar(player.name);

        card.innerHTML = `
            <div class="small-card-face">
                <div class="avatar-placeholder">
                    <img class="member-avatar" src="${avatarSrc}" alt="${player.name}" 
                         onerror="this.style.display='none'; this.parentElement.innerHTML='${this.getInitials(player.name)}';">
                </div>
            </div>
            <div class="small-card-info">
                <h3>${player.name}</h3>
                <p>${teamName}</p>
                <div class="score">${player.role}</div>
            </div>
        `;

        return card;
    }

    // 获取默认头像路径
    getDefaultAvatar(playerName) {
        // 根据选手姓名尝试匹配头像文件
        const avatarMappings = {
            'xXD': '/assets/images/faces/player/xXD.jpg',
            'Dialectic': '/assets/images/faces/player/Dialectic.jpg',
            '百万': '/assets/images/faces/player/前航远歌.jpg',
            '乘槎一问津': '/assets/images/faces/player/乘槎一问津.jpg',
            '长风': '/assets/images/faces/player/雨落星辰.jpg',
            '天堂支点': '/assets/images/faces/player/天堂支点.jpg'
        };

        return avatarMappings[playerName] || '';
    }

    // 获取姓名首字母
    getInitials(name) {
        if (!name) return '?';

        // 对于中文名字，取第一个字符
        if (/[\u4e00-\u9fa5]/.test(name)) {
            return name.charAt(0);
        }

        // 对于英文名字，取首字母
        return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
    }

    // 根据选手姓名和队伍名称查找选手数据
    findPlayerData(playerName, teamName) {
        if (!this.eventData[teamName]) return null;
        
        const players = this.eventData[teamName];
        for (const playerKey in players) {
            if (players[playerKey].name === playerName) {
                return players[playerKey];
            }
        }
        return null;
    }

    // 绑定事件
    bindEvents() {
        // 选手卡片点击事件
        if (this.teamsContainer) {
            this.teamsContainer.addEventListener('click', (e) => {
                const card = e.target.closest('.small-card');
                if (card) {
                    this.openModal(card);
                }
            });
        }

        // 模态框关闭事件
        if (this.closeModal) {
            this.closeModal.addEventListener('click', () => this.closeModalHandler());
        }

        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', (e) => {
                if (e.target === this.modalOverlay) {
                    this.closeModalHandler();
                }
            });
        }

        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modalOverlay && this.modalOverlay.classList.contains('active')) {
                this.closeModalHandler();
            }
        });
    }

    // 打开模态框
    openModal(card) {
        if (!this.modalOverlay) return;

        const playerName = card.getAttribute('data-player-name');
        const teamName = card.getAttribute('data-team-name');
        const playerRole = card.getAttribute('data-player-role');
        const avatarImg = card.querySelector('.member-avatar');

        // 设置模态框内容
        const modalName = document.getElementById('modalName');
        const modalTeam = document.getElementById('modalTeam');
        const modalRole = document.getElementById('modalRole');
        const modalEvent = document.getElementById('modalEvent');
        const modalAvatar = document.getElementById('modalMemberAvatar');

        if (modalName) modalName.textContent = playerName;
        if (modalTeam) modalTeam.textContent = teamName;
        if (modalRole) modalRole.textContent = playerRole;
        if (modalEvent) modalEvent.textContent = '紫金杯#3';

        // 设置模态框头像 - 修复默认头像显示问题
        if (modalAvatar) {
            // 重置模态框头像容器
            modalAvatar.style.display = 'block';
            modalAvatar.parentElement.innerHTML = '<img class="member-avatar" id="modalMemberAvatar">';
            const newModalAvatar = document.getElementById('modalMemberAvatar');
            
            // 获取当前选手的实际头像路径，而不是依赖小卡片的状态
            const currentPlayerData = this.findPlayerData(playerName, teamName);
            const actualAvatarSrc = currentPlayerData ? currentPlayerData.avatar : null;
            
            if (actualAvatarSrc && actualAvatarSrc !== '') {
                // 如果有头像路径（包括默认头像），使用该头像
                newModalAvatar.src = actualAvatarSrc;
                newModalAvatar.alt = playerName;
                newModalAvatar.onerror = () => {
                    // 只有在图片加载失败时才显示首字母
                    newModalAvatar.style.display = 'none';
                    const initials = this.getInitials(playerName);
                    newModalAvatar.parentElement.innerHTML = initials;
                };
            } else {
                // 如果没有头像路径，显示首字母
                newModalAvatar.style.display = 'none';
                newModalAvatar.parentElement.innerHTML = this.getInitials(playerName);
            }
        }

        this.modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // 关闭模态框
    closeModalHandler() {
        if (this.modalOverlay) {
            this.modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new EventManager();
});