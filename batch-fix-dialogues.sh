#!/bin/bash

# 修复所有对话文件
for file in dialogues/*.html; do
    echo "Fixing $file"
    
    # 1. 添加电脑端背包按钮
    sed -i '' '/<!-- 移动端信息按钮 -->/i\    <!-- 电脑端信息按钮 -->\
    <div id="desktop-info-btn" style="position: fixed; top: 20px; right: 20px; width: 50px; height: 50px; border-radius: 50%; background: #667eea; color: white; border: none; font-size: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); z-index: 999; cursor: pointer; display: flex; align-items: center; justify-content: center;">📦</div>\
' $file
    
    # 2. 更新updateInfoPanel函数，使其不自动显示面板
    # 首先删除旧的updateInfoPanel函数
    sed -i '' '/function updateInfoPanel() {/,/function showDesktopSidebar()/{//!d; /function updateInfoPanel() {/{h; d;}; /function showDesktopSidebar()/{x; p;};}' $file
    
    # 然后插入新的updateInfoPanel函数
    sed -i '' '/function updateInfoPanel() {/a\            const isMobile = window.innerWidth <= 768;\
\
            // 控制按钮显示\
            const mobileBtn = document.getElementById(\'mobile-info-btn\');\
            if (mobileBtn) {\
                mobileBtn.style.display = (isMobile && gameState.gameStarted) ? \'flex\' : \'none\';\
            }\
\
            // 电脑端按钮显示\
            const desktopBtn = document.getElementById(\'desktop-info-btn\');\
            if (desktopBtn) {\
                desktopBtn.style.display = (!isMobile && gameState.gameStarted) ? \'flex\' : \'none\';\
            }\
\
            if (!gameState.gameStarted) {\
                hideMobileInfoPanel();\
                hideDesktopSidebar();\
                return;\
            }\
\
            // 屏幕切换时，先关闭所有面板\
            hideMobileInfoPanel();\
            hideDesktopSidebar();\
\
            // 根据屏幕大小更新对应的面板内容，但不自动显示\
            if (!isMobile) {\
                // 电脑端更新侧边栏内容，但不自动显示\
                updateDesktopSidebarContent();\
                return;\
            }\
' $file
    
    # 3. 添加hideDesktopSidebar和updateDesktopSidebarContent函数
    # 找到hideMobileInfoPanel函数的结束位置
    # 然后插入新函数
    sed -i '' '/function hideMobileInfoPanel() {/,/^        }/{/^        }/a\
        // 隐藏电脑端侧边栏\
        function hideDesktopSidebar() {\
            const sidebar = document.getElementById(\'desktop-sidebar\');\
            if (sidebar) {\
                sidebar.style.display = \'none\';\
            }\
        }\
\
        // 更新电脑端侧边栏内容（但不显示）\
        function updateDesktopSidebarContent() {\
            const content = document.getElementById(\'desktop-sidebar-content\');\
            if (content) {\
                const char = window.characters[gameState.selectedCharacter];\
                content.innerHTML = `\
                    <div style=\"margin-bottom: 15px;\">\
                        <strong>当前角色：</strong><br>\
                        <span style=\"color: #667eea; font-size: 16px;\">${char.name}</span><br>\
                        <small style=\"color: #666;\">${char.title}</small>\
                    </div>\
\
                    <h4 style=\"margin: 15px 0 10px 0; color: #667eea; font-size: 14px;\">📦 背包</h4>\
                    <div id=\"desktop-inventory\">\
                        ${gameState.playerInventory.length === 0 ?\
                            \'<div style=\"color: #999; font-style: italic; padding: 10px;\">背包是空的</div>\' :\
                            gameState.playerInventory.map(item =>\
                                \`<div style=\"padding: 8px; margin: 5px 0; background: #f8f9ff; border-radius: 5px; border-left: 3px solid #667eea;\">\${getItemDisplayName(item)}\</div>\`\
                            ).join(\'\')\
                        }\
                    </div>\
\
                    <div style=\"margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;\">\
                        <strong>第 ${gameState.currentDay} 天</strong>\
                    </div>\
                `;\
            }\
        }\
' $file
    
    # 4. 更新事件绑定，添加电脑端按钮事件和窗口大小改变事件监听
    # 先删除旧的事件绑定
    sed -i '' '/document.addEventListener(\'DOMContentLoaded\', function() {/,/^        });/{//!d; /document.addEventListener(\'DOMContentLoaded\', function() {/{h; d;}; /^        });/{x; p;};}' $file
    
    # 然后插入新的事件绑定
    sed -i '' '/document.addEventListener(\'DOMContentLoaded\', function() {/a\            loadGameState();\
            updateInfoPanel();\
\
            // 移动端按钮事件\
            const mobileBtn = document.getElementById(\'mobile-info-btn\');\
            if (mobileBtn) {\
                mobileBtn.addEventListener(\'click\', toggleMobileInfoPanel);\
            }\
\
            // 电脑端按钮事件\
            const desktopBtn = document.getElementById(\'desktop-info-btn\');\
            if (desktopBtn) {\
                desktopBtn.addEventListener(\'click\', function() {\
                    const sidebar = document.getElementById(\'desktop-sidebar\');\
                    if (sidebar.style.display === \'block\') {\
                        hideDesktopSidebar();\
                    } else {\
                        updateDesktopSidebarContent();\
                        sidebar.style.display = \'block\';\
                    }\
                });\
            }\
\
            // 遮罩层点击关闭\
            document.addEventListener(\'click\', function(e) {\
                if (e.target.id === \'mobile-overlay\') {\
                    hideMobileInfoPanel();\
                }\
            });\
\
            // ESC键关闭\
            document.addEventListener(\'keydown\', function(e) {\
                if (e.keyCode === 27) {\
                    hideMobileInfoPanel();\
                    hideDesktopSidebar();\
                }\
            });\
\
            // 窗口大小改变事件监听\
            window.addEventListener(\'resize\', function() {\
                updateInfoPanel();\
            });\
' $file
    
done

echo "All dialogue files fixed!"