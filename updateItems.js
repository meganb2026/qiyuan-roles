const fs = require('fs');
const path = require('path');

// 获取所有物品详情页
const itemsDir = '/Users/qiweibao/IdeaProjects/qiyuan-roles/items';
const itemFiles = fs.readdirSync(itemsDir).filter(file => file.startsWith('item-') && file.endsWith('.html'));

// 处理每个文件
itemFiles.forEach(file => {
    const filePath = path.join(itemsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. 添加itemStories.js引用
    if (!content.includes('itemStories.js')) {
        content = content.replace(
            '<script src="../assets/js/items.js"></script>',
            '<script src="../assets/js/items.js"></script>\n    <script src="../assets/js/itemStories.js"></script>'
        );
    }
    
    // 2. 删除重复的itemStories数据
    const startMarker = '// 物品故事数据';
    const endMarker = '// 从localStorage加载游戏状态';
    const startIndex = content.indexOf(startMarker);
    const endIndex = content.indexOf(endMarker, startIndex);
    
    if (startIndex !== -1 && endIndex !== -1) {
        // 找到结束位置的正确索引（包括结束标记之前的所有内容）
        const endContent = content.substring(endIndex);
        const cleanContent = content.substring(0, startIndex) + endContent;
        content = cleanContent;
    }
    
    // 保存修改后的文件
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${file}`);
});

console.log('All files updated successfully!');