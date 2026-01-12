const fs = require('fs');
const path = require('path');

// 获取所有物品详情页
const itemsDir = '/Users/qiweibao/IdeaProjects/qiyuan-roles/items';
const itemFiles = fs.readdirSync(itemsDir).filter(file => file.startsWith('item-') && file.endsWith('.html'));

// 处理每个文件
itemFiles.forEach(file => {
    const filePath = path.join(itemsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 替换1: 移动端信息面板中的背包显示
    const pattern1 = /<h4>📦 背包<\/h4>\s*<div id="mobile-inventory">\s*\${gameState.playerInventory.length === 0 \?\s*'(<div style="color: #999; font-style: italic;">背包是空的<\/div>)' :\s*gameState.playerInventory.map\(item =>\s*`<div style="padding: 8px; margin: 5px 0; background: #f5f5f5; border-radius: 5px;">\${item}<\/div>`\s*\)\.join\(''\)\s*}\s*<\/div>/g;
    
    content = content.replace(pattern1, `<h4>📦 背包</h4>\n                    <div id="mobile-inventory">\n                        \${gameState.playerInventory.length === 0 ?\n                            '<div style="color: #999; font-style: italic;">背包是空的</div>' :\n                            gameState.playerInventory.map(item =>\n                                `<div style="padding: 8px; margin: 5px 0; background: #f5f5f5; border-radius: 5px;">\${getItemDisplayName(item)}</div>`\n                            ).join('')\n                        }\n                    </div>`);
    
    // 替换2: 电脑端侧边栏中的背包显示
    const pattern2 = /<h4 style="margin: 15px 0 10px 0; color: #667eea; font-size: 14px;">📦 背包<\/h4>\s*<div id="desktop-inventory">\s*\${gameState.playerInventory.length === 0 \?\s*'(<div style="color: #999; font-style: italic; padding: 10px;">背包是空的<\/div>)' :\s*gameState.playerInventory.map\(item =>\s*`<div style="padding: 8px; margin: 5px 0; background: #f8f9ff; border-radius: 5px; border-left: 3px solid #667eea;">\${item}<\/div>`\s*\)\.join\(''\)\s*}\s*<\/div>/g;
    
    content = content.replace(pattern2, `<h4 style="margin: 15px 0 10px 0; color: #667eea; font-size: 14px;">📦 背包</h4>\n                    <div id="desktop-inventory">\n                        \${gameState.playerInventory.length === 0 ?\n                            '<div style="color: #999; font-style: italic; padding: 10px;">背包是空的</div>' :\n                            gameState.playerInventory.map(item =>\n                                `<div style="padding: 8px; margin: 5px 0; background: #f8f9ff; border-radius: 5px; border-left: 3px solid #667eea;">\${getItemDisplayName(item)}</div>`\n                            ).join('')\n                        }\n                    </div>`);
    
    // 替换3: 切换移动端信息面板时的背包显示
    const pattern3 = /<h4>📦 背包<\/h4>\s*<div id="mobile-inventory">\s*\${gameState.playerInventory.length === 0 \?\s*'<div style="color: #999; font-style: italic;">背包是空的<\/div>' :\s*gameState.playerInventory.map\(item =>\s*`<div style="padding: 8px; margin: 5px 0; background: #f5f5f5; border-radius: 5px;">\${item}<\/div>`\s*\)\.join\(''\)\s*}\s*<\/div>/g;
    
    content = content.replace(pattern3, `<h4>📦 背包</h4>\n                        <div id="mobile-inventory">\n                            \${gameState.playerInventory.length === 0 ?\n                                '<div style="color: #999; font-style: italic;">背包是空的</div>' :\n                                gameState.playerInventory.map(item =>\n                                    `<div style="padding: 8px; margin: 5px 0; background: #f5f5f5; border-radius: 5px;">\${getItemDisplayName(item)}</div>`\n                                ).join('')\n                            }\n                        </div>`);
    
    // 保存修改后的文件
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${file}`);
});

console.log('All files updated successfully!');