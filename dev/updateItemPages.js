const fs = require('fs');
const path = require('path');

// 获取所有物品详情页
const itemsDir = '/Users/qiweibao/IdeaProjects/qiyuan-roles/items';
const itemFiles = fs.readdirSync(itemsDir).filter(file => file.startsWith('item-') && file.endsWith('.html'));

// 要替换的内容
const replacements = [
    {
        old: `                    <h4>📦 背包</h4>\n                    <div id="mobile-inventory">\n                        \${gameState.playerInventory.length === 0 ?\n                            '<div style="color: #999; font-style: italic;">背包是空的</div>' :\n                            gameState.playerInventory.map(item =>\n                                `<div style="padding: 8px; margin: 5px 0; background: #f5f5f5; border-radius: 5px;">\${item}</div>`\n                            ).join('')\n                        }\n                    </div>`,
        new: `                    <h4>📦 背包</h4>\n                    <div id="mobile-inventory">\n                        \${gameState.playerInventory.length === 0 ?\n                            '<div style="color: #999; font-style: italic;">背包是空的</div>' :\n                            gameState.playerInventory.map(item =>\n                                `<div style="padding: 8px; margin: 5px 0; background: #f5f5f5; border-radius: 5px;">\${getItemDisplayName(item)}</div>`\n                            ).join('')\n                        }\n                    </div>`
    },
    {
        old: `                    <h4 style="margin: 15px 0 10px 0; color: #667eea; font-size: 14px;">📦 背包</h4>\n                    <div id="desktop-inventory">\n                        \${gameState.playerInventory.length === 0 ?\n                            '<div style="color: #999; font-style: italic; padding: 10px;">背包是空的</div>' :\n                            gameState.playerInventory.map(item =>\n                                `<div style="padding: 8px; margin: 5px 0; background: #f8f9ff; border-radius: 5px; border-left: 3px solid #667eea;">\${item}</div>`\n                            ).join('')\n                        }\n                    </div>`,
        new: `                    <h4 style="margin: 15px 0 10px 0; color: #667eea; font-size: 14px;">📦 背包</h4>\n                    <div id="desktop-inventory">\n                        \${gameState.playerInventory.length === 0 ?\n                            '<div style="color: #999; font-style: italic; padding: 10px;">背包是空的</div>' :\n                            gameState.playerInventory.map(item =>\n                                `<div style="padding: 8px; margin: 5px 0; background: #f8f9ff; border-radius: 5px; border-left: 3px solid #667eea;">\${getItemDisplayName(item)}</div>`\n                            ).join('')\n                        }\n                    </div>`
    },
    {
        old: `                        <h4>📦 背包</h4>\n                        <div id="mobile-inventory">\n                            \${gameState.playerInventory.length === 0 ?\n                                '<div style="color: #999; font-style: italic;">背包是空的</div>' :\n                                gameState.playerInventory.map(item =>\n                                    `<div style="padding: 8px; margin: 5px 0; background: #f5f5f5; border-radius: 5px;">\${item}</div>`\n                                ).join('')\n                            }\n                        </div>`,
        new: `                        <h4>📦 背包</h4>\n                        <div id="mobile-inventory">\n                            \${gameState.playerInventory.length === 0 ?\n                                '<div style="color: #999; font-style: italic;">背包是空的</div>' :\n                                gameState.playerInventory.map(item =>\n                                    `<div style="padding: 8px; margin: 5px 0; background: #f5f5f5; border-radius: 5px;">\${getItemDisplayName(item)}</div>`\n                                ).join('')\n                            }\n                        </div>`
    }
];

// 处理每个文件
itemFiles.forEach(file => {
    const filePath = path.join(itemsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 应用所有替换
    let modified = false;
    replacements.forEach(replacement => {
        if (content.includes(replacement.old)) {
            content = content.replace(replacement.old, replacement.new);
            modified = true;
        }
    });
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${file}`);
    }
});

console.log('All files updated successfully!');