const fs = require('fs');
const path = require('path');

// 获取所有对话文件
const dialoguesDir = path.join(__dirname, 'dialogues');
const dialogueFiles = fs.readdirSync(dialoguesDir).filter(file => file.endsWith('.html'));

// 修复每个对话文件
for (const file of dialogueFiles) {
    const filePath = path.join(dialoguesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`Fixing file: ${file}`);
    
    // 1. 更新 updateInfoPanel 函数
    const oldUpdateInfoPanel = /function updateInfoPanel\(\) \{[\s\S]*?\}/;
    const newUpdateInfoPanel = `function updateInfoPanel() {
            const isMobile = window.innerWidth <= 768;

            // 控制按钮显示
            const mobileBtn = document.getElementById('mobile-info-btn');
            if (mobileBtn) {
                mobileBtn.style.display = (isMobile && gameState.gameStarted) ? 'flex' : 'none';
            }

            if (!gameState.gameStarted) {
                hideMobileInfoPanel();
                hideDesktopSidebar();
                return;
            }

            // 屏幕切换时，先关闭所有面板
            hideMobileInfoPanel();
            hideDesktopSidebar();

            // 根据屏幕大小更新对应的面板内容，但不自动显示
            if (!isMobile) {
                // 电脑端更新侧边栏内容，但不自动显示
                updateDesktopSidebarContent();
                return;
            }
        }`;
    
    content = content.replace(oldUpdateInfoPanel, newUpdateInfoPanel);
    
    // 2. 添加 hideDesktopSidebar 和 updateDesktopSidebarContent 函数
    if (!content.includes('function hideDesktopSidebar()')) {
        const hideMobileInfoPanelEnd = content.indexOf('}') + 1;
        const hideMobileInfoPanelIndex = content.indexOf('function hideMobileInfoPanel()');
        const afterHideMobileInfoPanel = content.indexOf('}', hideMobileInfoPanelIndex) + 1;
        
        const newFunctions = `

        // 隐藏电脑端侧边栏
        function hideDesktopSidebar() {
            const sidebar = document.getElementById('desktop-sidebar');
            if (sidebar) {
                sidebar.style.display = 'none';
            }
        }

        // 更新电脑端侧边栏内容（但不显示）
        function updateDesktopSidebarContent() {
            const content = document.getElementById('desktop-sidebar-content');
            if (content) {
                const char = window.characters[gameState.selectedCharacter];
                content.innerHTML = `
                    <div style="margin-bottom: 15px;">
                        <strong>当前角色：</strong><br>
                        <span style="color: #667eea; font-size: 16px;">${char.name}</span><br>
                        <small style="color: #666;">${char.title}</small>
                    </div>

                    <h4 style="margin: 15px 0 10px 0; color: #667eea; font-size: 14px;">📦 背包</h4>
                    <div id="desktop-inventory">
                        ${gameState.playerInventory.length === 0 ?
                            '<div style="color: #999; font-style: italic; padding: 10px;">背包是空的</div>' :
                            gameState.playerInventory.map(item =>
                                `<div style="padding: 8px; margin: 5px 0; background: #f8f9ff; border-radius: 5px; border-left: 3px solid #667eea;">${getItemDisplayName(item)}</div>`
                            ).join('')
                        }
                    </div>

                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
                        <strong>第 ${gameState.currentDay} 天</strong>
                    </div>
                `;
            }
        }`;
        
        content = content.slice(0, afterHideMobileInfoPanel) + newFunctions + content.slice(afterHideMobileInfoPanel);
    }
    
    // 3. 更新事件绑定，添加窗口大小改变事件监听和 esc 键关闭桌面侧边栏
    const oldEventBindings = /document\.addEventListener\('DOMContentLoaded', function\(\) \{[\s\S]*?\}\);/;
    const newEventBindings = `document.addEventListener('DOMContentLoaded', function() {
            loadGameState();
            updateInfoPanel();

            // 移动端按钮事件
            const mobileBtn = document.getElementById('mobile-info-btn');
            if (mobileBtn) {
                mobileBtn.addEventListener('click', toggleMobileInfoPanel);
            }

            // 遮罩层点击关闭
            document.addEventListener('click', function(e) {
                if (e.target.id === 'mobile-overlay') {
                    hideMobileInfoPanel();
                }
            });

            // ESC键关闭
            document.addEventListener('keydown', function(e) {
                if (e.keyCode === 27) {
                    hideMobileInfoPanel();
                    hideDesktopSidebar();
                }
            });

            // 窗口大小改变事件监听
            window.addEventListener('resize', function() {
                updateInfoPanel();
            });
        });`;
    
    content = content.replace(oldEventBindings, newEventBindings);
    
    // 4. 添加电脑端背包按钮
    if (!content.includes('desktop-info-btn')) {
        const mobileInfoBtn = '<div id="mobile-info-btn"';
        const newDesktopBtn = `<!-- 电脑端信息按钮 -->
    <div id="desktop-info-btn" style="position: fixed; top: 20px; right: 20px; width: 50px; height: 50px; border-radius: 50%; background: #667eea; color: white; border: none; font-size: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); z-index: 999; cursor: pointer; display: none; align-items: center; justify-content: center;">📦</div>
    
    ${mobileInfoBtn}`;
        
        content = content.replace(mobileInfoBtn, newDesktopBtn);
        
        // 添加电脑端按钮点击事件
        const mobileBtnEvent = 'mobileBtn.addEventListener(\'click\', toggleMobileInfoPanel);';
        const newDesktopBtnEvent = `${mobileBtnEvent}
            
            // 电脑端按钮事件
            const desktopBtn = document.getElementById('desktop-info-btn');
            if (desktopBtn) {
                desktopBtn.style.display = (!isMobile && gameState.gameStarted) ? 'flex' : 'none';
                desktopBtn.addEventListener('click', function() {
                    const sidebar = document.getElementById('desktop-sidebar');
                    if (sidebar.style.display === 'block') {
                        hideDesktopSidebar();
                    } else {
                        updateDesktopSidebarContent();
                        sidebar.style.display = 'block';
                    }
                });
            }`;
        
        content = content.replace(mobileBtnEvent, newDesktopBtnEvent);
        
        // 更新 updateInfoPanel 中的按钮显示逻辑
        const btnDisplayLogic = 'mobileBtn.style.display = (isMobile && gameState.gameStarted) ? \'flex\' : \'none\';';
        const newBtnDisplayLogic = `${btnDisplayLogic}
            
            // 电脑端按钮显示
            const desktopBtn = document.getElementById('desktop-info-btn');
            if (desktopBtn) {
                desktopBtn.style.display = (!isMobile && gameState.gameStarted) ? 'flex' : 'none';
            }`;
        
        content = content.replace(btnDisplayLogic, newBtnDisplayLogic);
    }
    
    // 写入修复后的文件
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed file: ${file}`);
}

console.log('All dialogue files fixed!');