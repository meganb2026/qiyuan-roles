// 自动更新所有HTML页面，添加背包改进功能脚本

const fs = require('fs');
const path = require('path');

// 要添加的脚本
const scriptsToAdd = [
    '<script src="assets/js/item-details.js"></script>',
    '<script src="assets/js/backpack-improvements.js"></script>'
];

// 遍历所有HTML文件
function updateAllPages() {
    const rootDir = path.join(__dirname);
    
    // 递归遍历目录
    function traverseDir(dir) {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
                // 跳过node_modules和.git目录
                if (file !== 'node_modules' && file !== '.git') {
                    traverseDir(filePath);
                }
            } else if (file.endsWith('.html')) {
                // 更新HTML文件
                updateHTMLFile(filePath);
            }
        });
    }
    
    traverseDir(rootDir);
}

// 更新单个HTML文件
function updateHTMLFile(filePath) {
    console.log(`正在更新文件: ${filePath}`);
    
    // 读取文件内容
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经添加了脚本
    let hasItemDetails = content.includes('item-details.js');
    let hasBackpackImprovements = content.includes('backpack-improvements.js');
    
    if (hasItemDetails && hasBackpackImprovements) {
        console.log(`文件 ${filePath} 已包含所有脚本，跳过。`);
        return;
    }
    
    // 找到脚本加载位置
    const scriptRegex = /<script[^>]+src="assets\/js\/itemStories\.js"><\/script>/;
    const match = content.match(scriptRegex);
    
    if (match) {
        // 在itemStories.js脚本后添加新脚本
        let newContent = content.replace(scriptRegex, match[0] + '\n    ' + scriptsToAdd.filter(script => !content.includes(script)).join('\n    '));
        
        // 写入更新后的内容
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`文件 ${filePath} 已更新。`);
    } else {
        console.log(`文件 ${filePath} 未找到itemStories.js脚本，跳过。`);
    }
}

// 执行更新
updateAllPages();
console.log('所有页面更新完成！');