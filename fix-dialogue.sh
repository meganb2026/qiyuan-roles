#!/bin/bash

# 获取所有对话文件
dialogue_files=$(ls dialogues/*.html)

# 修复每个对话文件
for file in $dialogue_files; do
    echo "Fixing file: $file"
    
    # 1. 更新 updateInfoPanel 函数，使其不自动显示面板
    sed -i '' 's/function updateInfoPanel() {[[:space:]]*const isMobile = window.innerWidth <= 768;[[:space:]]*//g' $file
    
    # 2. 替换整个 updateInfoPanel 函数
    cat > temp_update.txt << 'EOF'
        function updateInfoPanel() {
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
        }
EOF
    
    # 3. 添加 hideDesktopSidebar 和 updateDesktopSidebarContent 函数
    cat > temp_functions.txt << 'EOF'

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
        }
EOF
    
    # 4. 更新事件绑定
    cat > temp_events.txt << 'EOF'
        // 事件绑定
        document.addEventListener('DOMContentLoaded', function() {
            loadGameState();
            updateInfoPanel();

            // 移动端按钮事件
            const mobileBtn = document.getElementById('mobile-info-btn');
            if (mobileBtn) {
                mobileBtn.addEventListener('click', toggleMobileInfoPanel);
            }

            // 电脑端按钮事件
            const desktopBtn = document.getElementById('desktop-info-btn');
            if (desktopBtn) {
                desktopBtn.addEventListener('click', function() {
                    const sidebar = document.getElementById('desktop-sidebar');
                    if (sidebar.style.display === 'block') {
                        hideDesktopSidebar();
                    } else {
                        updateDesktopSidebarContent();
                        sidebar.style.display = 'block';
                    }
                });
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
        });
EOF
    
    # 5. 添加电脑端背包按钮
    cat > temp_button.txt << 'EOF'
    <!-- 电脑端信息按钮 -->
    <div id="desktop-info-btn" style="position: fixed; top: 20px; right: 20px; width: 50px; height: 50px; border-radius: 50%; background: #667eea; color: white; border: none; font-size: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); z-index: 999; cursor: pointer; display: flex; align-items: center; justify-content: center;">📦</div>

    <!-- 移动端信息按钮 -->
EOF
    
    # 6. 手动修改文件内容
    # 由于 sed 无法处理复杂的多行替换，我将使用更简单的方法
    # 读取文件内容，替换关键部分
    content=$(cat $file)
    
    # 替换 updateInfoPanel 函数
    content=$(echo "$content" | sed 's/function updateInfoPanel() {[\s\S]*?function showDesktopSidebar()/$(cat temp_update.txt)\n        function showDesktopSidebar()/')
    
    # 添加新函数
    content=$(echo "$content" | sed 's/function hideMobileInfoPanel() {[\s\S]*?function proceedToExchange()/function hideMobileInfoPanel() {[\s\S]*?$(cat temp_functions.txt)\n        function proceedToExchange()/')
    
    # 替换事件绑定
    content=$(echo "$content" | sed 's/document.addEventListener(\'DOMContentLoaded\', function() {[\s\S]*?});/$(cat temp_events.txt)/')
    
    # 添加电脑端按钮
    content=$(echo "$content" | sed 's/<!-- 移动端信息按钮 -->/$(cat temp_button.txt)/')
    
    # 写入修复后的内容
    echo "$content" > $file
    
done

# 清理临时文件
rm -f temp_update.txt temp_functions.txt temp_events.txt temp_button.txt

echo "All dialogue files fixed!"