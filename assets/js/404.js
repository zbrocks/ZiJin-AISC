// 404页面特定功能
document.addEventListener('DOMContentLoaded', function() {
    // 返回首页按钮
    const homeButton = document.getElementById('homeButton');
    
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
    
    // 添加图片悬停动画
    const errorImage = document.getElementById('errorImage');
    
    if (errorImage) {
        errorImage.addEventListener('mouseenter', function() {
            this.style.animation = 'float 1.5s ease-in-out';
        });
        
        errorImage.addEventListener('mouseleave', function() {
            this.style.animation = 'float 3s ease-in-out infinite';
        });
    }
    
    // 添加按钮点击动画
    homeButton.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(1px)';
        this.style.boxShadow = '0 2px 10px rgba(134, 93, 187, 0.3)';
    });
    
    homeButton.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 7px 20px rgba(255, 107, 107, 0.4)';
    });
    
    // 添加页面加载动画
    // document.querySelector('.error-card').style.opacity = '0';
    
    // setTimeout(() => {
    //     document.querySelector('.error-card').style.transition = 'opacity 0.8s ease-in-out';
    //     document.querySelector('.error-card').style.opacity = '1';
    // }, 100);
});