// 比赛事件管理
class EventManager {
    constructor() {
        this.eventData = {
            "SM坎诺特分队": {
                "Pan": {
                    "name": "Pan",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "MaoMao": {
                    "name": "毛毛",
                    "role": "创想家",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "XianWei": {
                    "name": "显微镜🔬",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                }
            },
            "亚军厨小队": {
                "NiYan": {
                    "name": "泥岩小队践行者组长",
                    "role": "创想家",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "NingMeng": {
                    "name": "一颗柠檬精",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "HengYin": {
                    "name": "恒音",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                }
            },
            "厨圣": {
                "FeiNi": {
                    "name": "妃你带我走吧😭😭😭",
                    "role": "创想家",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "QianHang": {
                    "name": "前航远歌",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/team/前航远歌.jpg"
                },
                "Natsuk": {
                    "name": "Natsuk",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                }
            },
            "蓝图测绘分队": {
                "NiDe": {
                    "name": "你的洛",
                    "role": "创想家",
                    "avatar": "/assets/images/faces/player/你的洛.jpg"
                },
                "ZZH": {
                    "name": "ZZH",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "shawryao": {
                    "name": "shawryao",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                }
            },
            "目光呆滞": {
                "ZhiHui": {
                    "name": "智慧的龙",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "XueLang": {
                    "name": "雪狼的利刃",
                    "role": "创想家",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "Salieri": {
                    "name": "SalieriAmA",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                }
            },
            "香橙蜜柑仙贝": {
                "Dialectic": {
                    "name": "Dialectic",
                    "role": "创想家",
                    "avatar": "/assets/images/faces/player/Dialectic.jpg"
                },
                "LZ": {
                    "name": "LZ",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/player/default.jpg"
                },
                "ChengCha": {
                    "name": "乘槎一问津",
                    "role": "讲述者",
                    "avatar": "/assets/images/faces/team/乘槎一问津.jpg"
                }
            }
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
            '你的洛': '/assets/images/faces/player/你的洛.jpg',
            'Dialectic': '/assets/images/faces/player/Dialectic.jpg',
            '前航远歌': '/assets/images/faces/team/前航远歌.jpg',
            '乘槎一问津': '/assets/images/faces/team/乘槎一问津.jpg'
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
        if (modalEvent) modalEvent.textContent = '紫金杯#2';

        // 设置模态框头像
        if (modalAvatar && avatarImg) {
            modalAvatar.src = avatarImg.src;
            modalAvatar.alt = playerName;
            modalAvatar.onerror = function() {
                this.style.display = 'none';
                this.parentElement.innerHTML = this.alt ? this.alt.charAt(0) : '?';
            };
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