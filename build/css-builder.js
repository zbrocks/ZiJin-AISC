const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const cssnano = require('cssnano');
const glob = require('glob');

// 主函数，处理CSS文件的合并和压缩
async function buildCSS() {
    try {
        // 定义需要处理的CSS文件路径
        const cssDir = path.join(__dirname, '..', 'assets', 'css');
        const distDir = path.join(__dirname, '..', 'dist', 'css');
        
        // 确保dist目录存在
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
        }
        
        // 获取所有CSS文件
        const cssFiles = glob.sync(path.join(cssDir, '*.css'));
        
        // 为FAQ页面创建专门的合并文件
        await processFAQCSS(cssFiles, distDir);
        
        // 处理其他单独的CSS文件
        for (const cssFile of cssFiles) {
            const fileName = path.basename(cssFile);
            await minifyCSSFile(cssFile, path.join(distDir, fileName));
        }
        
        console.log('CSS文件构建成功！');
    } catch (error) {
        console.error('CSS文件构建失败:', error);
        process.exit(1);
    }
}

// 处理FAQ页面的CSS合并
async function processFAQCSS(cssFiles, distDir) {
    // 合并common.css和faq.css
    const commonCSSFile = cssFiles.find(file => path.basename(file) === 'common.css');
    const faqCSSFile = cssFiles.find(file => path.basename(file) === 'faq.css');
    
    if (commonCSSFile && faqCSSFile) {
        const commonCSS = fs.readFileSync(commonCSSFile, 'utf8');
        const faqCSS = fs.readFileSync(faqCSSFile, 'utf8');
        
        const mergedCSS = commonCSS + '\n\n/* FAQ specific styles */\n\n' + faqCSS;
        const outputPath = path.join(distDir, 'faq-bundle.min.css');
        
        await minifyCSS(mergedCSS, outputPath);
        console.log('FAQ CSS bundle created successfully');
    }
}

// 压缩单个CSS文件
async function minifyCSSFile(sourcePath, outputPath) {
    const css = fs.readFileSync(sourcePath, 'utf8');
    await minifyCSS(css, outputPath);
}

// 使用postcss和cssnano压缩CSS
async function minifyCSS(css, outputPath) {
    const result = await postcss([cssnano({
        preset: ['default', {
            discardComments: {
                removeAll: true
            },
            discardDuplicates: true,
            discardEmpty: true,
            minifyFontValues: true,
            minifySelectors: true
        }]
    })]).process(css, { from: undefined });
    
    fs.writeFileSync(outputPath, result.css);
}

// 执行构建
buildCSS();