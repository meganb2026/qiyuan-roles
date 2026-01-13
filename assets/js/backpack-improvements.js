// 背包功能改进：将物品转换为可点击按钮显示详情

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 延迟执行，确保其他脚本已加载
    setTimeout(function() {
        convertInventoryItemsToButtons();
    }, 100);
    
    // 监听背包按钮点击事件
    setupBackpackButtonListeners();
});

// 设置背包按钮监听器
function setupBackpackButtonListeners() {
    // 监听移动端背包按钮
    const mobileBtn = document.getElementById('mobile-info-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', function() {
            // 延迟执行，确保面板已生成
            setTimeout(function() {
                convertInventoryItemsToButtons();
            }, 50);
        });
    }
    
    // 监听电脑端背包按钮
    const desktopBtn = document.getElementById('desktop-info-btn');
    if (desktopBtn) {
        desktopBtn.addEventListener('click', function() {
            // 延迟执行，确保面板已生成
            setTimeout(function() {
                convertInventoryItemsToButtons();
            }, 50);
        });
    }
}

// 将所有背包物品转换为可点击按钮
function convertInventoryItemsToButtons() {
    // 查找所有背包物品元素
    const inventoryContainers = document.querySelectorAll('#mobile-inventory, #desktop-inventory, .inventory-list');
    
    inventoryContainers.forEach(container => {
        // 查找所有物品元素
        const items = container.querySelectorAll('div');
        
        items.forEach(item => {
            // 检查是否已经是按钮
            if (item.tagName === 'BUTTON') return;
            
            // 检查是否是空背包提示
            if (item.textContent.includes('背包是空的')) return;
            
            // 获取物品名称
            const itemName = item.textContent.trim();
            
            // 查找对应的物品key
            const itemKey = findItemKeyByName(itemName);
            
            if (itemKey) {
                // 创建新按钮
                const button = document.createElement('button');
                button.textContent = itemName;
                button.onclick = function() {
                    showItemDetail(itemKey);
                };
                
                // 复制原有样式
                button.style.cssText = `
                    width: 100%;
                    text-align: left;
                    padding: 10px 12px;
                    margin: 5px 0;
                    background: ${item.style.background || '#f5f5f5'};
                    border: 1px solid #e0e0e0;
                    border-radius: 5px;
                    border-left: ${item.style.borderLeft || '3px solid #667eea'};
                    cursor: pointer;
                    transition: all 0.2s ease;
                `;
                
                // 替换原有元素
                item.parentNode.replaceChild(button, item);
            }
        });
    });
}

// 根据物品名称查找物品key
function findItemKeyByName(itemName) {
    if (!window.itemStories) return null;
    
    for (const key in window.itemStories) {
        if (window.itemStories[key].name === itemName) {
            return key;
        }
    }
    
    return null;
}