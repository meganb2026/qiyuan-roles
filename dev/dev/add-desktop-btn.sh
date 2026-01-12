#!/bin/bash

# 为所有对话文件添加电脑端背包按钮
for file in dialogues/*.html; do
    # 检查文件是否已经包含电脑端按钮
    if ! grep -q "desktop-info-btn" $file; then
        echo "Adding desktop button to $file"
        # 在移动端按钮前添加电脑端按钮
        sed -i '' '/<!-- 移动端信息按钮 -->/i\    <!-- 电脑端信息按钮 -->\
    <div id="desktop-info-btn" style="position: fixed; top: 20px; right: 20px; width: 50px; height: 50px; border-radius: 50%; background: #667eea; color: white; border: none; font-size: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); z-index: 999; cursor: pointer; display: flex; align-items: center; justify-content: center;">📦</div>\
' $file
    fi
    
    # 检查是否缺少电脑端按钮显示逻辑
    if ! grep -q "desktopBtn.style.display" $file; then
        echo "Adding desktop button display logic to $file"
        # 在移动端按钮显示逻辑后添加电脑端按钮显示逻辑
        sed -i '' '/mobileBtn.style.display = (isMobile && gameState.gameStarted) ? \'flex\' : \'none\';/a\            \
            // 电脑端按钮显示\
            const desktopBtn = document.getElementById(\'desktop-info-btn\');\
            if (desktopBtn) {\
                desktopBtn.style.display = (!isMobile && gameState.gameStarted) ? \'flex\' : \'none\';\
            }\
' $file
    fi
    
    # 检查是否缺少电脑端按钮事件
    if ! grep -q "desktopBtn.addEventListener" $file; then
        echo "Adding desktop button event to $file"
        # 在移动端按钮事件后添加电脑端按钮事件
        sed -i '' '/mobileBtn.addEventListener(\'click\', toggleMobileInfoPanel);/a\            \
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
' $file
    fi
    
    # 检查是否缺少窗口大小改变事件监听
    if ! grep -q "window.addEventListener('resize'" $file; then
        echo "Adding resize event listener to $file"
        # 在ESC键事件后添加窗口大小改变事件监听
        sed -i '' '/document.addEventListener(\'keydown\', function(e) {/,/^            });/{/^            });/a\
            \
            // 窗口大小改变事件监听\
            window.addEventListener(\'resize\', function() {\
                updateInfoPanel();\
            });\
' $file
    fi
    
done

echo "All desktop buttons added!"