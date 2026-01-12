const fs = require('fs');
const path = require('path');

// 物品详情页目录
const itemsDir = '/Users/qiweibao/IdeaProjects/qiyuan-roles/items';

// 读取目录中的所有HTML文件
const files = fs.readdirSync(itemsDir).filter(file => file.endsWith('.html'));

// 要替换的旧代码
const oldCode = `        function continueInvestigation() {
            // 返回第二天故事页面
            const gameUrl = \`../day2-story.html?character=${currentCharacter}&day=2&from=item-detail\`;
            window.location.href = gameUrl;
        }`;

// 新代码
const newCode = `        function continueInvestigation() {
            // 计算下一天
            const nextDay = gameState.currentDay + 1;
            
            // 更新游戏状态
            gameState.currentDay = nextDay;
            localStorage.setItem('qiyuanGameState', JSON.stringify(gameState));
            
            // 跳转到下一天的故事页面
            const gameUrl = \`../day${nextDay}-story.html?character=${currentCharacter}&day=${nextDay}&from=item-detail\`;
            window.location.href = gameUrl;
        }`;

// 遍历并修改每个文件
files.forEach(file => {
    const filePath = path.join(itemsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 替换代码
    if (content.includes(oldCode)) {
        content = content.replace(oldCode, newCode);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${file}`);
    } else {
        console.log(`Skipped: ${file} (no match)`);
    }
});

console.log('Batch update completed!');