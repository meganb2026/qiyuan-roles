#!/bin/bash

# 批量更新所有对话文件的UI显示逻辑

for file in dialogues/*.html; do
    echo "Updating $file..."

    # 更新函数名
    sed -i '' 's|updateMobileInfoPanel|updateInfoPanel|g' "$file"

    # 添加电脑端侧边栏HTML
    sed -i '' 's|<!-- 遮罩层 -->|    <!-- 电脑端侧边栏 -->\n    <div id="desktop-sidebar" style="display: none; position: fixed; top: 20px; right: 20px; width: 280px; max-height: 80vh; background: rgba(255, 255, 255, 0.95); border-radius: 10px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); z-index: 1000; padding: 20px; overflow-y: auto; border: 1px solid #e0e0e0;">\n        <h4 style="margin: 0 0 15px 0; color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 8px;">角色信息</h4>\n        <div id="desktop-sidebar-content">\n            <!-- 内容由JavaScript动态填充 -->\n        </div>\n    </div>\n\n    <!-- 遮罩层 -->|g' "$file"

    # 更新JavaScript逻辑
    sed -i '' 's|        // 更新移动端信息面板|        // 更新信息面板（支持移动端和电脑端）|g' "$file"

    sed -i '' 's|        function updateMobileInfoPanel() {|        function updateInfoPanel() {|g' "$file"

    sed -i '' 's|            if (!isMobile || !gameState.gameStarted) {|            if (!gameState.gameStarted) {|g' "$file"

    sed -i '' 's|                return;|                return;\n            }\n\n            // 如果是电脑端，直接显示侧边栏\n            if (!isMobile) {\n                showDesktopSidebar();\n                return;\n            }|g' "$file"

    # 添加showDesktopSidebar函数
    sed -i '' 's|        // 隐藏移动端信息面板|        // 显示电脑端侧边栏\n        function showDesktopSidebar() {\n            const sidebar = document.getElementById('\''desktop-sidebar'\'');\n            const content = document.getElementById('\''desktop-sidebar-content'\'');\n\n            if (sidebar && content) {\n                const char = window.characters[gameState.selectedCharacter];\n                content.innerHTML = `\n                    <div style="margin-bottom: 15px;">\n                        <strong>当前角色：</strong><br>\n                        <span style="color: #667eea; font-size: 16px;">\${char.name}</span><br>\n                        <small style="color: #666;">\${char.title}</small>\n                    </div>\n\n                    <h4 style="margin: 15px 0 10px 0; color: #667eea; font-size: 14px;">📦 背包</h4>\n                    <div id="desktop-inventory">\n                        \${gameState.playerInventory.length === 0 ?\n                            '\''<div style="color: #999; font-style: italic; padding: 10px;">背包是空的</div>'\'' :\n                            gameState.playerInventory.map(item =>\n                                `'\''<div style="padding: 8px; margin: 5px 0; background: #f8f9ff; border-radius: 5px; border-left: 3px solid #667eea;">\${item}</div>'\''`\n                            ).join('\''\'\'')\n                        }\n                    </div>\n\n                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">\n                        <strong>第 \${gameState.currentDay} 天</strong>\n                    </div>\n                `;\n                sidebar.style.display = '\''block'\'';\n            }\n        }\n\n        // 隐藏移动端信息面板|g' "$file"

    # 更新函数调用
    sed -i '' 's|updateMobileInfoPanel();|updateInfoPanel();|g' "$file"
done

echo "All dialogue files updated!"