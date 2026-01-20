// 游戏主要逻辑

class Game {
    constructor() {
        this.gameState = {
            selectedCharacter: null,
            currentDay: 1,
            gameStarted: false,
            playerInventory: [],
            allCharactersItems: {},
            npcs: [],
            goalCompleted: false,
            exchangedToday: false,
            exchangeHistory: []
        };
        this.currentPage = 'character-select';
        this.init();
    }

    init() {
        this.bindEvents();

        // 检查URL参数，看是否从剧情页面跳转回来
        const urlParams = new URLSearchParams(window.location.search);
        const from = urlParams.get('from');
        const character = urlParams.get('character');

        if (from === 'inner-thoughts' && character) {
            // 从内心独白页面返回，直接开始游戏
            this.gameState.selectedCharacter = character;
            const char = window.characters[character];
            this.gameState.playerInventory = [...char.initialItems];
            // 记录初始物品
            if (window.recordMultipleDiscoveredItems) {
                window.recordMultipleDiscoveredItems(char.initialItems);
            }
            this.gameState.gameStarted = true;
            this.showDayStart();
        } else {
            // 正常流程
            this.showCharacterSelect();
        }
    }

    bindEvents() {
        // 全局事件绑定
        document.addEventListener('click', (e) => {
            // 关闭移动端信息面板
            if (e.target.id === 'mobile-overlay') {
                this.hideMobileInfoPanel();
            }
        });

        // 移动端信息按钮点击事件
        const mobileBtn = document.getElementById('mobile-info-btn');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止事件冒泡
                this.toggleMobileInfoPanel();
            });
        }

        // 电脑端信息按钮点击事件
        const desktopBtn = document.getElementById('desktop-info-btn');
        if (desktopBtn) {
            desktopBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止事件冒泡
                this.toggleDesktopSidebar();
            });
        }

        // ESC键关闭面板
        document.addEventListener('keydown', (e) => {
            if (e.keyCode === 27) {
                this.hideMobileInfoPanel();
                this.hideDesktopSidebar();
            }
        });

        // 窗口大小改变事件监听
        window.addEventListener('resize', () => {
            this.updateInfoPanels();
        });
    }

    // 页面导航
    navigateTo(page, data = {}) {
        this.currentPage = page;
        switch(page) {
            case 'character-select':
                this.showCharacterSelect();
                break;
            case 'character-detail':
                this.showCharacterDetail(data.characterId);
                break;
            case 'confirm-character':
                this.showConfirmCharacter(data.characterId);
                break;
            case 'day-start':
                this.showDayStart();
                break;
            case 'day-exchange':
                this.showDayExchange();
                break;
            case 'game-ending':
                this.showGameEnding(data.ending);
                break;
        }
        this.updateInfoPanels();
    }

    // 显示角色选择页面
    showCharacterSelect() {
        const characterCards = Object.keys(window.characters).map(charId => {
            const char = window.characters[charId];
            return `
                <div class="character-card" onclick="game.navigateTo('character-detail', {characterId: '${charId}'})"><h3>${char.name} - ${char.title}</h3>
                    <p><em>${char.publicDescription}</em></p>
                    <div class="character-select-btn">选择角色</div>
                </div>
            `;
        }).join('');

        const html = `
            <div class="page-container">
                <h2>选择你的角色</h2>

                <p>伟大的丹麦王克劳狄斯正在修建他的宫殿，如今距离预计交付仅剩3天，突发巨变！</p>

                <p>施工运输队长王卫国忽然报告发现一具无名尸体，这让整个皇宫笼罩在阴谋和秘密之中，施工进度也停滞不前。</p>

                <p><em>请选择你的角色，并查看角色详情。</em></p>

                <div class="character-grid">
                    ${characterCards}
                </div>
            </div>
        `;

        document.getElementById('game-content').innerHTML = html;
        this.gameState.gameStarted = false;
        this.updateInfoPanels();
    }

    // 显示角色详情页面
    showCharacterDetail(characterId) {
        const char = window.characters[characterId];
        const html = `
            <div class="page-container">
                <h2>${char.name} - ${char.title}</h2>

                <div class="character-detail">
                    <h3>📖 你的故事</h3>
                    <p>${char.backstory}</p>

                    <h3>🎯 你的主线任务</h3>
                    <p>${char.goal}</p>

                    <h3>📦 初始装备</h3>
                    <ul>
                        ${char.initialItems.map(item => `<li>${window.getItemDisplayName(item)}</li>`).join('')}
                    </ul>

                    <div class="character-actions">
                        <button class="action-btn primary large" onclick="game.selectCharacter('${characterId}')">
                            开启旅途
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('game-content').innerHTML = html;
    }

    // 选择角色
    selectCharacter(characterId) {
        // 清除localStorage缓存，确保每次开始都是新游戏
        localStorage.removeItem('qiyuanGameState');
        
        this.gameState.selectedCharacter = characterId;
        const char = window.characters[characterId];

        // 初始化玩家装备
    this.gameState.playerInventory = [...char.initialItems];
    // 记录初始物品
    if (window.recordMultipleDiscoveredItems) {
        window.recordMultipleDiscoveredItems(char.initialItems);
    }

    // 初始化所有角色的装备
    this.gameState.allCharactersItems = {};
    this.gameState.allCharactersItems[characterId] = [...char.initialItems];

        // 创建NPC列表
        this.gameState.npcs = [];
        Object.keys(window.characters).forEach(id => {
            if (id !== characterId) {
                this.gameState.allCharactersItems[id] = [...window.characters[id].initialItems];
                this.gameState.npcs.push({
                    id: id,
                    name: window.characters[id].name,
                    title: window.characters[id].title,
                    items: [...window.characters[id].initialItems]
                });
            }
        });

        // 重置游戏状态
        this.gameState.currentDay = 1;
        this.gameState.goalCompleted = false;
        this.gameState.exchangedToday = false;
        this.gameState.exchangeHistory = [];
        this.gameState.gameStarted = true;

        this.navigateTo('confirm-character', {characterId});
    }

    // 显示角色确认页面
    showConfirmCharacter(characterId) {
        const char = window.characters[characterId];
        const html = `
            <div class="page-container">
                <h2>角色确认</h2>

                <div class="character-confirm">
                    <div class="character-info-large">
                        <h3>${char.name} - ${char.title}</h3>
                        <p><strong>身份：</strong> ${char.publicDescription}</p>
                        <p><strong>目标：</strong> ${char.goal}</p>

                        <h4>初始装备：</h4>
                        <ul>
                            ${char.initialItems.map(item => `<li>${window.getItemDisplayName(item)}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="confirm-actions">
                        <button class="action-btn primary large" onclick="game.startGame()">
                            开始第一天
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('game-content').innerHTML = html;
    }

    // 开始游戏
    startGame() {
        // 跳转到第一天剧情页面
        const sceneUrl = `day1-scene1.html?character=${this.gameState.selectedCharacter}`;
        window.location.href = sceneUrl;
    }

    // 显示天开始页面
    showDayStart() {
        const char = window.characters[this.gameState.selectedCharacter];
        const html = `
            <div class="page-container">
                <h2>第 ${this.gameState.currentDay} 章</h2>

                <div class="day-info">
                    <div class="character-status">
                        <h3>角色信息</h3>
                        <p><strong>${char.name} - ${char.title}</strong></p>
                        <p><strong>目标：</strong>${char.goal}</p>
                    </div>

                    <div class="inventory-status">
                        <h3>📦 当前装备</h3>
                        <div class="inventory-list">
                            ${this.gameState.playerInventory.length === 0 ?
                                '<p class="empty">背包是空的</p>' :
                                this.gameState.playerInventory.map(item =>
                                    `<div class="inventory-item">${window.getItemDisplayName(item)}</div>`
                                ).join('')
                            }
                        </div>
                    </div>

                    <div class="day-actions">
                        <button class="action-btn primary" onclick="game.navigateTo('day-exchange')">
                            开始交换装备
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('game-content').innerHTML = html;
    }

    // 显示装备交换页面
    showDayExchange() {
        const html = `
            <div class="page-container">
                <h2>第 ${this.gameState.currentDay} 章 - 装备交换</h2>

                <div class="exchange-info">
                    <p>你可以与其他角色交换一件装备。选择 wisely，这将影响你的最终目标！</p>

                    <div class="exchange-section">
                        <h3>你的装备</h3>
                        <div class="player-items">
                            ${this.gameState.playerInventory.map((item, index) =>
                                `<div class="exchange-item player-item" data-item="${item}" data-index="${index}">
                                    ${window.getItemDisplayName(item)}
                                </div>`
                            ).join('')}
                        </div>
                    </div>

                    <div class="exchange-section">
                        <h3>其他角色</h3>
                        <div class="npc-list">
                            ${this.gameState.npcs.map(npc => `
                                <div class="npc-card" data-npc-id="${npc.id}">
                                    <h4>${npc.name} - ${npc.title}</h4>
                                    <div class="npc-items">
                                        ${npc.items.map(item =>
                                            `<div class="exchange-item npc-item" data-item="${item}" data-npc="${npc.id}">
                                                ${window.getItemDisplayName(item)}
                                            </div>`
                                        ).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="exchange-actions">
                        <button class="action-btn primary" onclick="game.endDay()">
                            结束这一天
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('game-content').innerHTML = html;
        this.setupExchangeHandlers();
    }

    // 设置装备交换的事件处理器
    setupExchangeHandlers() {
        let selectedPlayerItem = null;
        let selectedNpcItem = null;
        let selectedNpcId = null;

        // 玩家物品选择
        document.querySelectorAll('.player-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.player-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                selectedPlayerItem = item.dataset.item;

                this.checkExchangeReady(selectedPlayerItem, selectedNpcItem);
            });
        });

        // NPC物品选择
        document.querySelectorAll('.npc-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.npc-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                selectedNpcItem = item.dataset.item;
                selectedNpcId = item.dataset.npc;

                this.checkExchangeReady(selectedPlayerItem, selectedNpcItem);
            });
        });
    }

    // 检查是否可以进行交换
    checkExchangeReady(playerItem, npcItem) {
        const exchangeBtn = document.getElementById('exchange-btn');
        if (!exchangeBtn) {
            if (playerItem && npcItem) {
                const btn = document.createElement('button');
                btn.id = 'exchange-btn';
                btn.className = 'action-btn primary';
                btn.textContent = '确认交换';
                btn.onclick = () => this.performExchange(playerItem, npcItem, selectedNpcId);
                document.querySelector('.exchange-actions').appendChild(btn);
            }
        } else {
            if (!playerItem || !npcItem) {
                exchangeBtn.remove();
            }
        }
    }

    // 执行装备交换
    performExchange(playerItem, npcItem, npcId) {
        if (this.gameState.exchangedToday) {
            alert('今天已经交换过装备了！');
            return;
        }

        // 找到NPC
        const npc = this.gameState.npcs.find(n => n.id === npcId);
        if (!npc) return;

        // 执行交换
        const playerIndex = this.gameState.playerInventory.indexOf(playerItem);
        const npcIndex = npc.items.indexOf(npcItem);

        if (playerIndex !== -1 && npcIndex !== -1) {
            // 交换物品
            this.gameState.playerInventory[playerIndex] = npcItem;
            npc.items[npcIndex] = playerItem;

            // 记录新获得的物品
            if (window.recordDiscoveredItem) {
                window.recordDiscoveredItem(npcItem);
            }

            // 记录交换历史
            this.gameState.exchangeHistory.push({
                day: this.gameState.currentDay,
                with: npc.name,
                myItem: playerItem,
                npcItem: npcItem
            });

            this.gameState.exchangedToday = true;

            alert(`成功与 ${npc.name} 交换装备！\n你失去了：${playerItem}\n你获得了：${npcItem}`);

            // 重新显示页面
            this.showDayExchange();
        }
    }

    // 结束一天
    endDay() {
        // 检查目标完成情况
        this.gameState.goalCompleted = window.checkGoal(
            this.gameState.playerInventory,
            this.gameState.selectedCharacter
        );

        const ending = window.getGameEnding(this.gameState.goalCompleted, this.gameState.currentDay);

        if (ending.type === 'success' || ending.type === 'failure') {
            // 游戏结束
            this.navigateTo('game-ending', {ending});
        } else {
            // 进入下一天
            this.gameState.currentDay++;
            this.gameState.exchangedToday = false;
            this.navigateTo('day-start');
        }
    }

    // 显示游戏结局
    showGameEnding(ending) {
        const char = window.characters[this.gameState.selectedCharacter];
        const html = `
            <div class="page-container">
                <h1 style="color: ${ending.type === 'success' ? 'green' : 'red'}; text-align: center;">
                    ${ending.title}
                </h1>

                <div class="ending-content" style="background: ${ending.type === 'success' ? '#e8f5e9' : '#ffebee'}; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h2>${ending.type === 'success' ? '恭喜你' : '很遗憾'}，${char.name}！</h2>

                    <p>${ending.message}</p>
                    <p><strong>${char.goal}</strong></p>

                    <h3>你的最终装备：</h3>
                    <ul>
                        ${this.gameState.playerInventory.map(item => `<li>${window.getItemDisplayName(item)}</li>`).join('')}
                    </ul>

                    <h3>交换记录：</h3>
                    ${this.gameState.exchangeHistory.length > 0 ?
                        `<ul>
                            ${this.gameState.exchangeHistory.map(record =>
                                `<li>第 ${record.day} 天：与 ${record.with} 交换了 "${window.getItemDisplayName(record.myItem)}" ↔ "${window.getItemDisplayName(record.npcItem)}"</li>`
                            ).join('')}
                        </ul>` :
                        '<p>你没有进行任何装备交换。</p>'
                    }
                </div>

                <div class="ending-actions">
                    <button class="action-btn primary" onclick="game.resetGame()">
                        重新开始
                    </button>
                </div>
            </div>
        `;

        document.getElementById('game-content').innerHTML = html;
    }

    // 重置游戏
    resetGame() {
        // 清除localStorage缓存
        localStorage.removeItem('qiyuanGameState');
        
        this.gameState = {
            selectedCharacter: null,
            currentDay: 1,
            gameStarted: false,
            playerInventory: [],
            allCharactersItems: {},
            npcs: [],
            goalCompleted: false,
            exchangedToday: false,
            exchangeHistory: []
        };
        this.navigateTo('character-select');
    }

    // 更新所有信息面板（移动端和桌面端）
    updateInfoPanels() {
        const isMobile = window.innerWidth <= 768;
        
        // 移动端面板更新
        const mobileBtn = document.getElementById('mobile-info-btn');
        if (mobileBtn) {
            if (isMobile && this.gameState.gameStarted) {
                mobileBtn.style.display = 'flex';
            } else {
                mobileBtn.style.display = 'none';
            }
        }

        // 桌面端面板更新
        const desktopBtn = document.getElementById('desktop-info-btn');
        if (desktopBtn) {
            if (!isMobile && this.gameState.gameStarted) {
                desktopBtn.style.display = 'flex';
            } else {
                desktopBtn.style.display = 'none';
            }
        }

        if (!this.gameState.gameStarted) {
            this.hideMobileInfoPanel();
            this.hideDesktopSidebar();
            return;
        }

        if (isMobile) {
            // 移动端更新
            this.updateMobileInfoPanel();
            this.hideDesktopSidebar();
        } else {
            // 桌面端更新
            this.updateDesktopSidebarContent();
            this.hideMobileInfoPanel();
        }
    }

    // 更新移动端信息面板
    updateMobileInfoPanel() {
        const isMobile = window.innerWidth <= 768;
        
        if (!isMobile || !this.gameState.gameStarted) {
            this.hideMobileInfoPanel();
            return;
        }

        const char = window.characters[this.gameState.selectedCharacter];
        const panel = document.getElementById('mobile-info-panel');
        const overlay = document.getElementById('mobile-overlay');

        if (panel && overlay) {
            panel.innerHTML = `
                <div class="character-info">
                    <strong>角色：</strong>
                    <span>${char.name}</span><br>
                    <small style="color: #666;">${char.title}</small>
                </div>

                <h4>📦 背包</h4>
                <div id="mobile-inventory">
                        ${this.gameState.playerInventory.length === 0 ?
                            '<div style="color: #999; font-style: italic;">背包是空的</div>' :
                            this.gameState.playerInventory.map(item =>
                                `<div style="padding: 8px; margin: 5px 0; background: #f5f5f5; border-radius: 5px;">${window.getItemDisplayName(item)}</div>`
                            ).join('')
                        }
                    </div>

                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
                    <strong>第 ${this.gameState.currentDay} 天</strong>
                </div>
            `;
        }
    }

    // 切换桌面端侧边栏显示/隐藏
    toggleDesktopSidebar() {
        const sidebar = document.getElementById('desktop-sidebar');
        if (sidebar) {
            if (sidebar.style.display === 'block') {
                this.hideDesktopSidebar();
            } else {
                this.showDesktopSidebar();
            }
        }
    }

    // 显示桌面端侧边栏
    showDesktopSidebar() {
        const sidebar = document.getElementById('desktop-sidebar');
        const content = document.getElementById('desktop-sidebar-content');

        if (sidebar && content && this.gameState.gameStarted) {
            const char = window.characters[this.gameState.selectedCharacter];
            content.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <strong>当前角色：</strong><br>
                    <span style="color: #667eea; font-size: 16px;">${char.name}</span><br>
                    <small style="color: #666;">${char.title}</small>
                </div>

                <h4 style="margin: 15px 0 10px 0; color: #667eea; font-size: 14px;">📦 背包</h4>
                <div id="desktop-inventory">
                    ${this.gameState.playerInventory.length === 0 ?
                        '<div style="color: #999; font-style: italic; padding: 10px;">背包是空的</div>' :
                        this.gameState.playerInventory.map(item =>
                            `<div style="padding: 8px; margin: 5px 0; background: #f8f9ff; border-radius: 5px; border-left: 3px solid #667eea;">${window.getItemDisplayName(item)}</div>`
                        ).join('')
                    }
                </div>

                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
                    <strong>第 ${this.gameState.currentDay} 天</strong>
                </div>
            `;
            sidebar.style.display = 'block';
        }
    }

    // 隐藏桌面端侧边栏
    hideDesktopSidebar() {
        const sidebar = document.getElementById('desktop-sidebar');
        if (sidebar) {
            sidebar.style.display = 'none';
        }
    }

    // 更新桌面端侧边栏内容
    updateDesktopSidebarContent() {
        const content = document.getElementById('desktop-sidebar-content');
        if (content && this.gameState.gameStarted) {
            const char = window.characters[this.gameState.selectedCharacter];
            content.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <strong>当前角色：</strong><br>
                    <span style="color: #667eea; font-size: 16px;">${char.name}</span><br>
                    <small style="color: #666;">${char.title}</small>
                </div>

                <h4 style="margin: 15px 0 10px 0; color: #667eea; font-size: 14px;">📦 背包</h4>
                <div id="desktop-inventory">
                    ${this.gameState.playerInventory.length === 0 ?
                        '<div style="color: #999; font-style: italic; padding: 10px;">背包是空的</div>' :
                        this.gameState.playerInventory.map(item =>
                            `<div style="padding: 8px; margin: 5px 0; background: #f8f9ff; border-radius: 5px; border-left: 3px solid #667eea;">${window.getItemDisplayName(item)}</div>`
                        ).join('')
                    }
                </div>

                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
                    <strong>第 ${this.gameState.currentDay} 天</strong>
                </div>
            `;
        }
    }

    // 切换移动端信息面板显示/隐藏
    toggleMobileInfoPanel() {
        const panel = document.getElementById('mobile-info-panel');
        if (panel) {
            const isVisible = panel.style.display === 'block';
            if (isVisible) {
                this.hideMobileInfoPanel();
            } else {
                this.showMobileInfoPanel();
            }
        }
    }

    // 显示移动端信息面板
    showMobileInfoPanel() {
        const panel = document.getElementById('mobile-info-panel');
        const overlay = document.getElementById('mobile-overlay');

        if (panel && overlay) {
            panel.style.display = 'block';
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    // 隐藏移动端信息面板
    hideMobileInfoPanel() {
        const panel = document.getElementById('mobile-info-panel');
        const overlay = document.getElementById('mobile-overlay');

        if (panel && overlay) {
            panel.style.display = 'none';
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
}

// 初始化游戏
    const game = new Game();
    
    // 持久化物品发现记录系统
    function initDiscoveredItemsSystem() {
        // 检查是否存在发现物品记录，如果不存在则创建
        if (!localStorage.getItem('qiyuanDiscoveredItems')) {
            localStorage.setItem('qiyuanDiscoveredItems', JSON.stringify([]));
        }
    }
    
    // 记录发现的物品
    function recordDiscoveredItem(itemKey) {
        // 获取当前发现物品列表
        const discoveredItems = JSON.parse(localStorage.getItem('qiyuanDiscoveredItems') || '[]');
        
        // 检查物品是否已经被记录
        if (!discoveredItems.includes(itemKey)) {
            // 添加到发现列表
            discoveredItems.push(itemKey);
            // 保存回localStorage
            localStorage.setItem('qiyuanDiscoveredItems', JSON.stringify(discoveredItems));
        }
    }
    
    // 记录多个发现的物品
    function recordMultipleDiscoveredItems(itemKeys) {
        // 获取当前发现物品列表
        const discoveredItems = JSON.parse(localStorage.getItem('qiyuanDiscoveredItems') || '[]');
        let hasNewItems = false;
        
        // 检查每个物品是否已经被记录
        itemKeys.forEach(itemKey => {
            if (!discoveredItems.includes(itemKey)) {
                // 添加到发现列表
                discoveredItems.push(itemKey);
                hasNewItems = true;
            }
        });
        
        // 如果有新物品，保存回localStorage
        if (hasNewItems) {
            localStorage.setItem('qiyuanDiscoveredItems', JSON.stringify(discoveredItems));
        }
    }
    
    // 获取所有发现的物品
    function getDiscoveredItems() {
        return JSON.parse(localStorage.getItem('qiyuanDiscoveredItems') || '[]');
    }
    
    // 初始化物品发现系统
    initDiscoveredItemsSystem();
    
    // 添加到全局对象
    window.recordDiscoveredItem = recordDiscoveredItem;
    window.recordMultipleDiscoveredItems = recordMultipleDiscoveredItems;
    window.getDiscoveredItems = getDiscoveredItems;