// 显示物品简介模态框
function showItemDetail(itemKey) {
    const item = window.itemStories[itemKey];
    if (!item) return;

    // 创建模态框
    let modal = document.getElementById('item-detail-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'item-detail-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(modal);

        // 关闭模态框的点击事件
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideItemDetail();
            }
        });
    }

    // 模态框内容
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 15px;
            padding: 2em;
            max-width: 800px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        ">
            <h3 style="margin-top: 0; color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 15px;">
                ${item.name}
            </h3>
            <div style="margin: 1.5em 0;">
                <strong style="color: #667eea;">描述：</strong>
                <p>${item.description}</p>
            </div>
            <div style="margin: 1.5em 0;">
                <strong style="color: #667eea;">故事：</strong>
                <p>${item.story}</p>
            </div>
            <button onclick="hideItemDetail()" style="
                background: #667eea;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 1em;
                margin-top: 1em;
            ">
                关闭
            </button>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// 隐藏物品简介模态框
function hideItemDetail() {
    const modal = document.getElementById('item-detail-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    document.body.style.overflow = '';
}