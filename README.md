# ZiJin A.I.S.C. 紫金杯集成战略赛事官网

## 项目简介

紫金杯集成战略赛事（ZiJin Arknights Integrated Strategies Competition）是由杭州市学军中学紫金港校区学生主办，面向全杭州市高中生的《明日方舟》集成战略模式竞赛。本项目是赛事的官方网站，提供赛事信息、规则说明、选手展示、比赛结果等功能。

## 项目特色

- 🏆 **赛事管理** - 完整的赛事信息展示和管理系统
- 👥 **选手展示** - 参赛选手和主办团队的详细信息
- 📊 **计分系统** - 实时比赛计分板和结果展示
- 📱 **响应式设计** - 支持多设备访问的现代化界面
- 🌙 **主题切换** - 支持明暗主题切换
- 📺 **视频回放** - 比赛录像和精彩回放展示

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **样式**: 原生CSS + Font Awesome 图标
- **交互**: 原生JavaScript，无框架依赖
- **部署**: 静态网站，支持任意Web服务器

## 项目结构

```
ZiJin-AISC/
├── index.html              # 首页
├── 404.html               # 404错误页面
├── README.md              # 项目说明文档
├── .gitignore             # Git忽略文件
├── assets/                # 静态资源目录
│   ├── css/              # 样式文件
│   │   ├── common.css    # 通用样式
│   │   ├── index.css     # 首页样式
│   │   ├── article.css   # 文章页样式
│   │   ├── figure.css    # 人物展示样式
│   │   └── ...          # 其他页面样式
│   ├── js/               # JavaScript文件
│   │   ├── common.js     # 通用脚本
│   │   ├── index.js      # 首页脚本
│   │   └── events/       # 赛事相关脚本
│   ├── images/           # 图片资源
│   │   ├── faces/        # 人物头像
│   │   ├── icons/        # 图标文件
│   │   ├── index/        # 首页轮播图
│   │   └── other/        # 其他图片
│   └── FAQs.md           # 常见问题文档
└── pages/                # 页面目录
    ├── FAQ.html          # 常见问题页面
    ├── team.html         # 主办团队页面
    ├── hall-of-fame.html # 名人堂页面
    ├── past-event.html   # 往届比赛页面
    ├── articles/         # 文章页面
    ├── events/           # 赛事详情页面
    └── rules/            # 规则页面
```

## 功能模块

### 🏠 首页 (index.html)
- 轮播图展示
- 赛事计分板
- 最新动态
- 社交媒体链接

### 🏆 往届比赛 (pages/past-event.html)
- 历届赛事回顾
- 比赛结果展示
- 精彩瞬间回放

### 👑 名人堂 (pages/hall-of-fame.html)
- 优秀选手展示
- 获奖记录
- 选手详细信息

### 👥 主办团队 (pages/team.html)
- 团队成员介绍
- 职责分工
- 联系方式

### ❓ 常见问题 (pages/FAQ.html)
- 参赛相关问题
- 比赛规则说明
- 技术支持

### 📋 赛事详情 (pages/events/)
- 具体赛事信息
- 参赛选手名单
- 比赛结果
- 视频回放链接

## 快速开始

### 本地运行

1. 克隆项目到本地
```bash
git clone [项目地址]
cd ZiJin-AISC
```

2. 使用任意Web服务器运行
```bash
# 使用Python内置服务器
python -m http.server 8000

# 或使用Node.js的http-server
npx http-server

# 或使用PHP内置服务器
php -S localhost:8000
```

3. 在浏览器中访问 `http://localhost:8000`

### 部署

项目为纯静态网站，可部署到任意支持静态文件的服务器：

- GitHub Pages
- Netlify
- Vercel
- 传统Web服务器 (Apache, Nginx等)

## 开发指南

### 添加新赛事

1. 在 `pages/events/` 目录下创建新的HTML文件
2. 在 `assets/js/events/` 目录下创建对应的JavaScript文件
3. 更新首页的赛事链接和信息

### 更新选手信息

1. 修改对应赛事页面的JavaScript文件中的选手数据
2. 添加选手头像到 `assets/images/faces/player/` 目录
3. 更新名人堂页面（如需要）

### 样式定制

- 主要样式定义在 `assets/css/common.css`
- 各页面特定样式在对应的CSS文件中
- 支持CSS变量，便于主题定制

## 赛事信息

### 已举办赛事
- **紫金杯#1** (2024年7月) - 首届赛事
- **紫金杯#2** (2025年1月) - 第二届赛事  
- **紫金杯#3** (2025年7月) - 第三届赛事

### 参赛对象
- 杭州各校高中生
- 高中毕业生

### 比赛模式
- 使用《明日方舟》集成战略模式
- 团队或个人报名
- 分初赛和决赛阶段

## 联系方式

- **微信**: xXD66c
- **QQ**: 1075243585
- **邮箱**: zj_aisc@qq.com
- **Bilibili**: [赛事官方账号](https://space.bilibili.com/1488722556)

## 贡献指南

欢迎为项目贡献代码或提出建议：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目仅用于教育和非商业用途。

## 致谢

感谢所有参与紫金杯赛事的选手、主办团队成员以及支持者们！

---

*"弘扬不再目光呆滞，助力DLC2后玩法改革，引领中学生健康打集，发现与培养集成战略新苗"*
