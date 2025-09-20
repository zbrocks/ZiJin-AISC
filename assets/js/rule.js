// 规则页面特定功能
document.addEventListener('DOMContentLoaded', function () {
    // 高亮当前查看的规则部分
    const sections = document.querySelectorAll('.rule-card');
    const menuLinks = document.querySelectorAll('.rules-category a');

    // 滚动到指定部分
    menuLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // 关闭所有打开的目录
                document.querySelectorAll('.rules-category').forEach(details => {
                    details.open = false;
                });

                // 打开当前目录
                this.closest('details').open = true;

                // 滚动到目标区域
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });

                // 更新活动链接
                menuLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // 监听滚动事件以高亮当前部分
    window.addEventListener('scroll', function () {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (pageYOffset >= sectionTop) {
                currentSection = '#' + section.getAttribute('id');
            }
        });

        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    });

    // 初始化页面
    if (location.hash) {
        const targetSection = document.querySelector(location.hash);
        if (targetSection) {
            // 滚动到目标区域
            setTimeout(() => {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }, 500);

            // 高亮当前链接
            menuLinks.forEach(link => {
                if (link.getAttribute('href') === location.hash) {
                    link.classList.add('active');
                    // 打开当前目录
                    link.closest('details').open = true;
                }
            });
        }
    }
});