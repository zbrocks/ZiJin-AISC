const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const glob = require('glob');

// 主函数，处理JavaScript文件的合并和压缩
async function buildJS() {
    try {
        // 定义需要处理的JS文件路径
        const jsDir = path.join(__dirname, '..', 'assets', 'js');
        const distDir = path.join(__dirname, '..', 'dist', 'js');
        
        // 确保dist目录存在
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
        }
        
        // 获取所有JS文件
        const jsFiles = glob.sync(path.join(jsDir, '*.js'));
        
        // 为FAQ页面创建专门的合并文件
        await processFAQJS(jsFiles, distDir);
        
        // 处理其他单独的JS文件
        for (const jsFile of jsFiles) {
            const fileName = path.basename(jsFile);
            await minifyJSFile(jsFile, path.join(distDir, fileName.replace('.js', '.min.js')));
        }
        
        console.log('JavaScript文件构建成功！');
    } catch (error) {
        console.error('JavaScript文件构建失败:', error);
        process.exit(1);
    }
}

// 处理FAQ页面的JS合并
async function processFAQJS(jsFiles, distDir) {
    // 合并common.js和faq.js
    const commonJSFile = jsFiles.find(file => path.basename(file) === 'common.js');
    const faqJSFile = jsFiles.find(file => path.basename(file) === 'faq.js');
    
    if (commonJSFile && faqJSFile) {
        const commonJS = fs.readFileSync(commonJSFile, 'utf8');
        const faqJS = fs.readFileSync(faqJSFile, 'utf8');
        
        // 合并文件，注意顺序：先common后faq
        const mergedJS = commonJS + '\n\n/* FAQ specific scripts */\n\n' + faqJS;
        const outputPath = path.join(distDir, 'faq-bundle.min.js');
        
        // 压缩合并后的文件
        const result = await minify(mergedJS, {
            compress: {
                drop_console: true,
                dead_code: true,
                unused: true
            },
            mangle: {
                toplevel: true
            },
            format: {
                comments: false,
                quote_style: 1
            }
        });
        
        if (result.error) {
            throw result.error;
        }
        
        fs.writeFileSync(outputPath, result.code);
        console.log('FAQ JS bundle created successfully');
    }
}

// 压缩单个JS文件
async function minifyJSFile(sourcePath, outputPath) {
    const js = fs.readFileSync(sourcePath, 'utf8');
    
    try {
        const result = await minify(js, {
            compress: {
                drop_console: true,
                dead_code: true,
                unused: true
            },
            mangle: {
                toplevel: true
            },
            format: {
                comments: false,
                quote_style: 1
            }
        });
        
        if (result.error) {
            throw result.error;
        }
        
        fs.writeFileSync(outputPath, result.code);
        console.log(`Minified: ${path.basename(sourcePath)}`);
    } catch (error) {
        console.error(`Error minifying ${path.basename(sourcePath)}:`, error);
        // 复制原始文件作为后备
        fs.writeFileSync(outputPath.replace('.min.js', '.js'), js);
    }
}

// 执行构建
buildJS();