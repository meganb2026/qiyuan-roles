// 结算系统

// 统一的结算入口方法
function startSettlement() {
    // 从localStorage获取游戏状态
    const savedState = localStorage.getItem('qiyuanGameState');
    if (!savedState) {
        console.error('游戏状态不存在');
        return;
    }
    
    const gameState = JSON.parse(savedState);
    const currentCharacter = gameState.selectedCharacter || 'claudius';
    
    // 检查背包里是否有骰子
    if (gameState.playerInventory && gameState.playerInventory.includes('dice')) {
        // 跳转到骰子决定页面
        // 使用更简单可靠的路径计算方法
        window.location.href = getRelativePathTo('results/dice-decision.html') + '?character=' + currentCharacter;
        return;
    }
    
    // 先计算出结局，然后跳转到结局过渡页面
    calculateEndingAndRedirect(currentCharacter);
}

// 辅助函数：计算结局并跳转到结局过渡页面
function calculateEndingAndRedirect(currentCharacter, from = '') {
    // 计算结局
    const result = calculateSettlementResult(currentCharacter, from);
    
    // 从localStorage获取游戏状态
    const savedState = localStorage.getItem('qiyuanGameState');
    const gameState = savedState ? JSON.parse(savedState) : {
        selectedCharacter: currentCharacter,
        playerInventory: [],
        allCharactersItems: {},
        npcs: []
    };
    
    // 记录结局ID
    recordDiscoveredEnding(currentCharacter, gameState.playerInventory || [], result, from);
    
    // 获取结局ID
    let endingId = '';
    // 检查背包中是否有one-line-of-code，触发公共结局
    const inventory = gameState.playerInventory || [];
    if (inventory.includes('one-line-of-code')) {
        endingId = 'general-failure-code';
    } else if (from === 'map-discard') {
        endingId = 'general-failure-map';
    } else if (from === 'dice') {
        endingId = 'general-failure-dice';
    } else if (result.title === '你登基了') {
        endingId = 'easter-egg-ascend';
    } else if (result.title === '你成功了' && result.content.includes('你看了看痒痒挠')) {
        endingId = 'general-success-scratcher';
    } else if (result.title === '你成功了' && result.content.includes('隔离霜假白')) {
        endingId = 'general-success-primer';
    } else {
        // 根据角色和背包物品确定结局ID
        const inventory = gameState.playerInventory || [];
        switch (currentCharacter) {
            case 'claudius':
                if (result.title === '你成功了') {
                    if (inventory.includes('clothes')) {
                        endingId = 'claudius-success-clothes';
                    } else if (inventory.includes('mentor-notes')) {
                        endingId = 'claudius-success-notes';
                    }
                } else if (result.title === '你失败了') {
                    endingId = 'claudius-failure';
                }
                break;
            case 'chengying':
                if (result.title === '你成功了') {
                    if (inventory.includes('diving-equipment')) {
                        endingId = 'chengying-success-diving';
                    } else if (inventory.includes('mentor-notes')) {
                        endingId = 'chengying-success-notes';
                    }
                } else if (result.title === '你失败了') {
                    endingId = 'chengying-failure';
                }
                break;
            case 'hefei':
                if (result.title === '你成功了') {
                    if (inventory.includes('weekly-report')) {
                        endingId = 'hefei-success-report';
                    } else if (inventory.includes('pearl-pass')) {
                        endingId = 'hefei-success-pass';
                    }
                } else if (result.title === '你失败了') {
                    if (inventory.includes('flashlight')) {
                        endingId = 'hefei-failure-flashlight';
                    } else if (inventory.includes('crown')) {
                        endingId = 'hefei-failure-crown';
                    } else {
                        endingId = 'hefei-failure';
                    }
                }
                break;
            case 'lixiang':
                if (result.title === '你成功了') {
                    if (inventory.includes('sleeping-pill')) {
                        endingId = 'lixiang-success-pill';
                    } else if (inventory.includes('weekly-report')) {
                        endingId = 'lixiang-success-report';
                    }
                } else if (result.title === '你失败了') {
                    endingId = 'lixiang-failure';
                }
                break;
            case 'wangweiguo':
                if (result.title === '你成功了') {
                    if (inventory.includes('pearl-pass')) {
                        endingId = 'wangweiguo-success-pass';
                    } else if (inventory.includes('underground-system-blueprint')) {
                        endingId = 'wangweiguo-success-blueprint';
                    }
                } else if (result.title === '你失败了') {
                    endingId = 'wangweiguo-failure';
                }
                break;
            case 'wuzhizhe':
                if (result.title === '你成功了') {
                    if (inventory.includes('chinese-herbs')) {
                        endingId = 'wuzhizhe-success-herbs';
                    } else if (inventory.includes('underground-system-blueprint')) {
                        endingId = 'wuzhizhe-success-blueprint';
                    }
                } else if (result.title === '你失败了') {
                    endingId = 'wuzhizhe-failure';
                }
                break;
            default:
                if (result.title === '你失败了') {
                    endingId = currentCharacter + '-failure';
                }
                break;
        }
    }
    
    // 跳转到结局过渡页面
    window.location.href = getRelativePathTo('results/ending-transition.html') + '?character=' + currentCharacter + '&endingId=' + endingId;
}

// 辅助函数：获取从当前页面到目标路径的相对路径
function getRelativePathTo(targetPath) {
    // 获取当前页面的完整URL
    const currentUrl = window.location.href;
    
    // 确保targetPath不包含重复的results/前缀
    const cleanTargetPath = targetPath.replace(/^results\//, '');
    
    // 如果是file://协议，使用基于当前文件位置的相对路径
    if (currentUrl.startsWith('file://')) {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/results/')) {
            // 如果当前页面在results目录下，直接返回目标文件名
            return cleanTargetPath;
        } else {
            // 检查当前文件是否位于特定子目录中
            // 如果位于locations、exchanges、items、dialogues等目录中，返回../results/cleanTargetPath
            // 否则，直接返回results/cleanTargetPath
            const isInSubdirectory = currentPath.includes('/locations/') || 
                                   currentPath.includes('/exchanges/') || 
                                   currentPath.includes('/items/') || 
                                   currentPath.includes('/dialogues/');
            
            if (isInSubdirectory) {
                // 如果在子目录中，返回../results/cleanTargetPath
                return '../results/' + cleanTargetPath;
            } else {
                // 否则，直接返回results/cleanTargetPath
                return 'results/' + cleanTargetPath;
            }
        }
    }
    
    // 对于HTTP协议，使用更可靠的路径计算方法
    try {
        // 获取当前脚本的位置，确定results目录的位置
        let resultsDirPath = '';
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const scriptSrc = scripts[i].src;
            if (scriptSrc.includes('settlement.js')) {
                resultsDirPath = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1);
                break;
            }
        }
        
        // 如果找到了settlement.js脚本的位置，使用它来构建目标路径
        if (resultsDirPath) {
            // 构建完整的目标URL（只使用cleanTargetPath，不包含results/前缀）
            const targetUrl = new URL(cleanTargetPath, resultsDirPath);
            // 返回从当前页面到目标URL的相对路径
            return new URL(targetUrl, currentUrl).pathname;
        }
        
        // 否则，使用基于当前页面路径的相对路径
        const currentPath = window.location.pathname;
        if (currentPath.includes('/results/')) {
            // 如果当前页面在results目录下，直接返回目标文件名
            return cleanTargetPath;
        } else {
            // 否则，返回../results/目标文件名或results/目标文件名，取决于当前页面的深度
            const pathSegments = currentPath.split('/').filter(segment => segment);
            if (pathSegments.length > 0) {
                // 如果当前页面在子目录下，使用../results/目标文件名
                return '../results/' + cleanTargetPath;
            } else {
                // 否则，直接使用results/目标文件名
                return 'results/' + cleanTargetPath;
            }
        }
    } catch (error) {
        console.error('路径计算错误:', error);
        // 出错时返回一个安全的默认路径
        return 'results/' + cleanTargetPath;
    }
}

// 计算结算结果
function calculateSettlementResult(currentCharacter = 'claudius', from = '') {
    // 从URL参数获取endingId
    const urlParams = new URLSearchParams(window.location.search);
    const endingId = urlParams.get('endingId') || '';
    
    // 如果有endingId参数，直接使用对应的结局内容
    if (endingId) {
        // 结局内容映射
        const endingContents = {
            'general-failure-code': {
                title: '你失败了',
                content: '你达成了: 404 not found'
            },
            'general-failure-map': {
                title: '你失败了',
                content: '失去了方向的你迷路了。'
            },
            'general-failure-dice': {
                title: '你失败了',
                content: '敢把命运交给骰子，你才是真的何非。'
            },
            'general-success-scratcher': {
                title: '你成功了',
                content: '大家都没有找到凶手，克劳狄斯听说了勃然大怒。你看了看痒痒挠，决定得挠人处且挠人。你挠了挠他，他笑了。'
            },
            'general-success-primer': {
                title: '你成功了',
                content: '隔离霜假白。你被洗白了。'
            },
            'easter-egg-ascend': {
                title: '你登基了',
                content: '你查了半块窗帘布的出处，克劳狄斯穿的“黄袍”竟真是窗帘布。看着手上的权杖，你福至心灵。'
            },
            // 角色特定结局
            'claudius-success-clothes': {
                title: '你成功了',
                content: '原来李想是哈姆雷特易容的，穿羽绒服是因为要到英格兰去。'
            },
            'claudius-success-notes': {
                title: '你成功了',
                content: '你顺着手记找到了篡位的证据，并且偷偷销毁了它。至于吴智哲那个傻小子，呵。'
            },
            'claudius-failure': {
                title: '你失败了',
                content: '没想到你没能等到凶杀案的线索，程婴联合吴智哲却发现了你当年篡位的证据并公之于众。天下皆惊竟有人为了皇位弄死自己的兄长，你被愤怒的人们处死了。'
            },
            'chengying-success-diving': {
                title: '你成功了',
                content: '没想到克劳狄斯谋反的证据还真的在下水道的控制室后的暗室里。下水道虽窄，你的义举犹如一人渡过了七条大河。'
            },
            'chengying-success-notes': {
                title: '你成功了',
                content: '你找到吴智哲，把知道的一切告诉了他。吴智哲无谓，不怕冬天的下水道有多冷，跳下去找到了克劳狄斯谋反的证据。'
            },
            'chengying-failure': {
                title: '你失败了',
                content: '很不幸，你没有找到克劳狄斯谋反的证据。众人也没有找到凶杀案的真凶。'
            },
            'hefei-success-report': {
                title: '你成功了',
                content: '你编造了一个故事，说是李想的设计有问题王卫国他们替他遮掩了，成功嫁祸李想和王卫国。克劳狄斯因此给你了一笔钱。'
            },
            'hefei-success-pass': {
                title: '你成功了',
                content: '王卫国的团队不是卡住无法施工了吗？现在肯定很需要通关令牌。你把它卖给王卫国，让施工队可以继续施工不受案情影响。他给了你一大笔，你还清了赌债。'
            },
            'hefei-failure-flashlight': {
                title: '你失败了',
                content: '很不幸大家都没有头绪。克劳狄斯问，你不是要让他眼前一亮吗？你打开了手电筒。'
            },
            'hefei-failure-crown': {
                title: '你失败了',
                content: '可恶克劳狄斯竟然给珍珠下毒，你被毒死了。'
            },
            'hefei-failure': {
                title: '你失败了',
                content: '很不幸所有人都没有找到元凶，克劳狄斯大怒觉得你耍他，把你处死了。'
            },
            'lixiang-success-pill': {
                title: '你成功了',
                content: '你找到王宫的里的侍卫证实了当晚下暴雨的事实，这恰好证明下水道系统排水很好所以第二天没有看到水。至于尸体，不是淹死的，说明和下水道设计无关。'
            },
            'lixiang-success-report': {
                title: '你成功了',
                content: '你拿着王卫国的周报证明了自己的工作。至于尸体，不是淹死的，说明和下水道设计无关。'
            },
            'lixiang-failure': {
                title: '你失败了',
                content: '大家都没有找到证据。何非为了证明自己昨天的戏是有意义的，编造了一个故事，说下水道设计不合理导致里面常年有蛇，死者是被吓死的，让克劳狄斯把你处死了。'
            },
            'wangweiguo-success-pass': {
                title: '你成功了',
                content: '队友们拿着你给的通关令牌，果然可以继续施工了！你们成功完工，回家过了一个好年。至于凶杀案，听说克劳狄斯找到了元凶。'
            },
            'wangweiguo-success-blueprint': {
                title: '你成功了',
                content: '你拿着下水道图纸让兄弟们顺利继续施工，成功结算回家过了一个好年。至于凶杀案，听说克劳狄斯找到了元凶。'
            },
            'wangweiguo-failure': {
                title: '你失败了',
                content: '时间到了，所有人都没有找到元凶。何非编造了一个故事，说你报告尸体是因为心虚，让克劳狄斯把你处死了。'
            },
            'wuzhizhe-success-herbs': {
                title: '你成功了',
                content: '你吃了人参，大补。于是凭着一腔孤勇跳下了水，摸到一个机关，上面的图案和导师手记上的一模一样。原来这里有一个暗室，里面藏着克劳狄斯当年为了皇位谋杀了自己的哥哥的证物。你推测死者也是想去寻找这个证据，因为意外遭遇了不幸。'
            },
            'wuzhizhe-success-blueprint': {
                title: '你成功了',
                content: '你认真读了下水道的设计图纸，和建筑设计图一比对，发现了一个暗室。在里面找到一个证物，赫然写着克劳狄斯当年为了皇位谋杀了自己的哥哥。你推测死者也是想去寻找这个证据，因为意外遭遇了不幸。'
            },
            'wuzhizhe-failure': {
                title: '你失败了',
                content: '时间到了，所有人都没有找到元凶。何非编造了一个故事，让克劳狄斯把你处死了。'
            }
        };
        
        // 如果找到了对应的结局，直接返回
        if (endingContents[endingId]) {
            const result = endingContents[endingId];
            // 记录发现的结局
            const savedState = localStorage.getItem('qiyuanGameState');
            const gameState = savedState ? JSON.parse(savedState) : {
                selectedCharacter: currentCharacter,
                playerInventory: [],
                allCharactersItems: {},
                npcs: []
            };
            
            // 直接使用endingId作为结局ID，不调用recordDiscoveredEnding函数重新计算
            // 从localStorage获取当前的发现结局列表
            const discoveredEndings = JSON.parse(localStorage.getItem('qiyuanDiscoveredEndings') || '[]');
            // 如果结局ID不在列表中，添加进去
            if (!discoveredEndings.includes(endingId)) {
                discoveredEndings.push(endingId);
                localStorage.setItem('qiyuanDiscoveredEndings', JSON.stringify(discoveredEndings));
            }
            
            return result;
        }
    }
    
    // 检查是否是从骰子页面跳转过来的
    if (from === 'dice') {
        const result = {
            title: '你失败了',
            content: '敢把命运交给骰子，你才是真的何非。'
        };
        recordDiscoveredEnding(currentCharacter, [], result, from);
        return result;
    }
    
    // 检查是否是丢弃地图导致的失败
    if (from === 'map-discard') {
        const result = {
            title: '你失败了',
            content: '失去了地图的你迷路了。'
        };
        recordDiscoveredEnding(currentCharacter, [], result, from);
        return result;
    }
    
    // 从localStorage获取游戏状态
    const savedState = localStorage.getItem('qiyuanGameState');
    if (!savedState) {
        return {
            title: '你失败了',
            content: '游戏状态丢失，无法计算结果。'
        };
    }
    
    const gameState = JSON.parse(savedState);
    // 使用游戏状态中的角色，而不是传入的参数
    const actualCharacter = gameState.selectedCharacter || currentCharacter;
    const inventory = gameState.playerInventory || [];
    
    // 新的结算条件
    let result;
    // 0. 公共结局：任何角色，拥有one-line-of-code
    if (inventory.includes('one-line-of-code')) {
        result = {
            title: '你失败了',
            content: '你达成了: 404 not found'
        };
    } else if (actualCharacter !== 'claudius' && inventory.includes('crown') && inventory.includes('half-piece-curtain')) {
        // 1. 非Claudius角色，同时拥有crown和half-piece-curtain
        result = {
            title: '你登基了',
            content: '既然黄袍是窗帘布，这个世界是个草台班子嘛。看着手上的权杖，你福至心灵。。'
        };
    } else if (actualCharacter !== 'claudius' && inventory.includes('scratcher')) {
        // 2. 非Claudius角色，拥有scratcher
        result = {
            title: '你成功了',
            content: '大家都没有找到凶手，克劳狄斯听说了勃然大怒。你看了看痒痒挠，决定得挠人处且挠人。你挠了挠他，他笑了。'
        };
    } else if ((actualCharacter === 'claudius' || actualCharacter === 'hefei') && inventory.includes('primer')) {
        // 3. Claudius或何非，拥有primer
        result = {
            title: '你成功了',
            content: '隔离霜假白。你被洗白了。'
        };
    } else {
        // 生成个性化消息和标题
        result = generatePersonalizedMessage(actualCharacter, inventory);
    }
    
    // 记录发现的结局
    recordDiscoveredEnding(actualCharacter, inventory, result, from);
    
    return result;
}

// 检查玩家是否成功
function checkSuccess(character, inventory) {
    // 根据角色设置成功条件
    switch (character) {
        case "claudius":
            // 克劳狄斯：背包中有吴智哲老师的手记或李想的羽绒服
            return inventory.includes("mentor-notes") || inventory.includes("clothes");
        case "chengying":
            // 程婴：背包中有克劳狄斯的大珍珠权杖和半块窗帘布时登基，否则背包中有何非的潜水服或吴智哲老师的手记时成功
            if (inventory.includes("crown") && inventory.includes("curtain-cloth")) {
                return true;
            }
            return inventory.includes("diving-equipment") || inventory.includes("mentor-notes");
        case "hefei":
            // 何非：背包中有王卫国的周报或克劳狄斯的通关令牌
            return inventory.includes("weekly-report") || inventory.includes("pearl-pass");
        case "lixiang":
            // 李想：背包中有程婴的安眠药或王卫国的周报
            return inventory.includes("sleeping-pill") || inventory.includes("weekly-report");
        case "wangweiguo":
            // 王卫国：背包中有克劳狄斯的通关令牌或李想的下水道图纸
            return inventory.includes("pearl-pass") || inventory.includes("underground-system-blueprint");
        case "wuzhizhe":
            // 吴智哲：背包中有程婴的草药或李想的下水道图纸
            return inventory.includes("chinese-herbs") || inventory.includes("underground-system-blueprint");
        default:
            return false;
    }
}

// 生成基于角色和背包的个性化结果消息
function generatePersonalizedMessage(character, inventory) {
    // 根据角色和背包内容生成个性化消息
    switch (character) {
        case "claudius":
            if (inventory.includes("clothes")) {
                return {
                    title: '你成功了',
                    content: '原来李想是哈姆雷特易容的，穿羽绒服是因为要到英格兰去。'
                };
            } else if (inventory.includes("mentor-notes")) {
                return {
                    title: '你成功了',
                    content: '你顺着手记找到了篡位的证据，并且偷偷销毁了它。至于吴智哲那个傻小子，呵。'
                };
            } else {
                return {
                    title: '你失败了',
                    content: '没想到你没能等到凶杀案的线索，程婴联合吴智哲却发现了你当年篡位的证据并公之于众。天下皆惊竟有人为了皇位弄死自己的兄长，你被愤怒的人们处死了。'
                };
            }
        case "chengying":
             if (inventory.includes("diving-equipment")) {
                return {
                    title: '你成功了',
                    content: '没想到克劳狄斯谋反的证据还真的在下水道的控制室后的暗室里。下水道虽窄，你的义举犹如一人渡过了七条大河。'
                };
            } else if (inventory.includes("mentor-notes")) {
                return {
                    title: '你成功了',
                    content: '你找到吴智哲，把知道的一切告诉了他。吴智哲无谓，不怕冬天的下水道有多冷，跳下去找到了克劳狄斯谋反的证据。'
                };
            } else {
                return {
                    title: '你失败了',
                    content: '很不幸，你没有找到克劳狄斯谋反的证据。众人也没有找到凶杀案的真凶。'
                };
            }
        case "hefei":
            if (inventory.includes("weekly-report")) {
                return {
                    title: '你成功了',
                    content: '你编造了一个故事，说是李想的设计有问题王卫国他们替他遮掩了，成功嫁祸李想和王卫国。克劳狄斯因此给你了一笔钱。'
                };
            } else if (inventory.includes("pearl-pass")) {
                return {
                    title: '你成功了',
                    content: '王卫国的团队不是卡住无法施工了吗？现在肯定很需要通关令牌。你把它卖给王卫国，让施工队可以继续施工不受案情影响。他给了你一大笔，你还清了赌债。'
                };
            } else if (inventory.includes("flashlight")) {
                return {
                  title: '你失败了',
                  content: '很不幸大家都没有头绪。克劳狄斯问，你不是要让他眼前一亮吗？你打开了手电筒。'
                };
            } else if (inventory.includes("crown")) {
                return {
                    title: '你失败了',
                    content: '可恶克劳狄斯竟然给珍珠下毒，你被毒死了。'
                };
            } else {
                return {
                    title: '你失败了',
                    content: '很不幸所有人都没有找到元凶，克劳狄斯大怒觉得你耍他，把你处死了。'
                };
            }
        case "lixiang":
            if (inventory.includes("sleeping-pill")) {
                return {
                    title: '你成功了',
                    content: '你找到王宫的里的侍卫证实了当晚下暴雨的事实，这恰好证明下水道系统排水很好所以第二天没有看到水。至于尸体，不是淹死的，说明和下水道设计无关。'
                };
            } else if (inventory.includes("weekly-report")) {
                return {
                    title: '你成功了',
                    content: '你拿着王卫国的周报证明了自己的工作。至于尸体，不是淹死的，说明和下水道设计无关。'
                };
            } else {
                return {
                    title: '你失败了',
                    content: '大家都没有找到证据。何非为了证明自己昨天的戏是有意义的，编造了一个故事，说下水道设计不合理导致里面常年有蛇，死者是被吓死的，让克劳狄斯把你处死了。'
                };
            }
        case "wangweiguo":
            if (inventory.includes("pearl-pass")) {
                return {
                    title: '你成功了',
                    content: '队友们拿着你给的通关令牌，果然可以继续施工了！你们成功完工，回家过了一个好年。至于凶杀案，听说克劳狄斯找到了元凶。'
                };
            } else if (inventory.includes("underground-system-blueprint")) {
                return {
                    title: '你成功了',
                    content: '你拿着下水道图纸让兄弟们顺利继续施工，成功结算回家过了一个好年。至于凶杀案，听说克劳狄斯找到了元凶。'
                };
            } else {
                return {
                    title: '你失败了',
                    content: '时间到了，所有人都没有找到元凶。何非编造了一个故事，说你报告尸体是因为心虚，让克劳狄斯把你处死了。'
                };
            }
        case "wuzhizhe":
            if (inventory.includes("chinese-herbs")) {
                return {
                    title: '你成功了',
                    content: '你吃了人参，大补。于是凭着一腔孤勇跳下了水，摸到一个机关，上面的图案和导师手记上的一模一样。原来这里有一个暗室，里面藏着克劳狄斯当年为了皇位谋杀了自己的哥哥的证物。你推测死者也是想去寻找这个证据，因为意外遭遇了不幸。'
                };
            } else if (inventory.includes("underground-system-blueprint")) {
                return {
                    title: '你成功了',
                    content: '你认真读了下水道的设计图纸，和建筑设计图一比对，发现了一个暗室。在里面找到一个证物，赫然写着克劳狄斯当年为了皇位谋杀了自己的哥哥。你推测死者也是想去寻找这个证据，因为意外遭遇了不幸。'
                };
            } else {
                return {
                    title: '你失败了',
                    content: '时间到了，所有人都没有找到元凶。何非编造了一个故事，让克劳狄斯把你处死了。'
                };
            }
        default:
            return {
                title: '游戏结束',
                content: '游戏结束。感谢您的游玩！'
            };
    }
}

// 处理丢弃地图的失败情况
function handleMapDiscard() {
    // 从localStorage获取游戏状态
    const savedState = localStorage.getItem('qiyuanGameState');
    if (!savedState) {
        console.error('游戏状态不存在');
        return;
    }
    
    const gameState = JSON.parse(savedState);
    const currentCharacter = gameState.selectedCharacter || 'claudius';
    
    // 计算结局并跳转到结局过渡页面
    calculateEndingAndRedirect(currentCharacter, 'map-discard');
}

// 记录发现的结局
function recordDiscoveredEnding(character, inventory, result, from) {
    console.log('=== 开始记录结局 ===');
    console.log('角色:', character);
    console.log('背包物品:', inventory);
    console.log('结局:', result);
    console.log('来源:', from);
    
    // 获取当前的发现结局列表
    const discoveredEndings = JSON.parse(localStorage.getItem('qiyuanDiscoveredEndings') || '[]');
    console.log('当前已发现的结局:', discoveredEndings);
    
    let endingId = '';
    
    // 根据不同的情况确定结局ID
    if (inventory.includes('one-line-of-code')) {
        // 公共结局：拥有one-line-of-code
        endingId = 'general-failure-code';
    } else if (from === 'map-discard') {
        // 丢弃地图的失败结局
        endingId = 'general-failure-map';
    } else if (from === 'dice') {
        // 摇骰子的失败结局
        endingId = 'general-failure-dice';
    } else if (result.title === '你登基了') {
        // 登基结局（彩蛋）
        endingId = 'easter-egg-ascend';
    } else if (result.title === '你成功了' && result.content.includes('你看了看痒痒挠')) {
        // 痒痒挠成功结局（通用）
        endingId = 'general-success-scratcher';
    } else if (result.title === '你成功了' && result.content.includes('隔离霜假白')) {
        // 隔离霜成功结局（通用）
        endingId = 'general-success-primer';
    } else {
        // 根据角色和背包物品确定结局ID
        switch (character) {
            case 'claudius':
                if (result.title === '你成功了') {
                    if (inventory.includes('clothes')) {
                        endingId = 'claudius-success-clothes';
                    } else if (inventory.includes('mentor-notes')) {
                        endingId = 'claudius-success-notes';
                    }
                } else if (result.title === '你失败了') {
                    endingId = 'claudius-failure';
                }
                break;
            case 'chengying':
                if (result.title === '你成功了') {
                    if (inventory.includes('diving-equipment')) {
                        endingId = 'chengying-success-diving';
                    } else if (inventory.includes('mentor-notes')) {
                        endingId = 'chengying-success-notes';
                    }
                } else if (result.title === '你失败了') {
                    endingId = 'chengying-failure';
                }
                break;
            case 'hefei':
                if (result.title === '你成功了') {
                    if (inventory.includes('weekly-report')) {
                        endingId = 'hefei-success-report';
                    } else if (inventory.includes('pearl-pass')) {
                        endingId = 'hefei-success-pass';
                    }
                } else if (result.title === '你失败了') {
                    if (inventory.includes('flashlight')) {
                        endingId = 'hefei-failure-flashlight';
                    } else if (inventory.includes('crown')) {
                        endingId = 'hefei-failure-crown';
                    } else {
                        endingId = 'hefei-failure';
                    }
                }
                break;
            case 'lixiang':
                if (result.title === '你成功了') {
                    if (inventory.includes('sleeping-pill')) {
                        endingId = 'lixiang-success-pill';
                    } else if (inventory.includes('weekly-report')) {
                        endingId = 'lixiang-success-report';
                    }
                } else if (result.title === '你失败了') {
                    endingId = 'lixiang-failure';
                }
                break;
            case 'wangweiguo':
                if (result.title === '你成功了') {
                    if (inventory.includes('pearl-pass')) {
                        endingId = 'wangweiguo-success-pass';
                    } else if (inventory.includes('underground-system-blueprint')) {
                        endingId = 'wangweiguo-success-blueprint';
                    }
                } else if (result.title === '你失败了') {
                    endingId = 'wangweiguo-failure';
                }
                break;
            case 'wuzhizhe':
                if (result.title === '你成功了') {
                    if (inventory.includes('chinese-herbs')) {
                        endingId = 'wuzhizhe-success-herbs';
                    } else if (inventory.includes('underground-system-blueprint')) {
                        endingId = 'wuzhizhe-success-blueprint';
                    }
                } else if (result.title === '你失败了') {
                    endingId = 'wuzhizhe-failure';
                }
                break;
            default:
                // 处理其他角色的结局
                if (result.title === '你失败了') {
                    endingId = character + '-failure';
                }
                break;
        }
    }
    
    console.log('生成的结局ID:', endingId);
    
    // 如果确定了结局ID且尚未记录，则添加到列表中
    if (endingId && !discoveredEndings.includes(endingId)) {
        console.log('添加结局ID到localStorage:', endingId);
        discoveredEndings.push(endingId);
        localStorage.setItem('qiyuanDiscoveredEndings', JSON.stringify(discoveredEndings));
        console.log('更新后的已发现结局:', discoveredEndings);
    } else if (!endingId) {
        console.log('未生成结局ID');
    } else {
        console.log('结局ID已存在，跳过');
    }
    
    console.log('=== 结局记录完成 ===');
}

// 为了兼容性，添加到全局对象
if (typeof window !== 'undefined') {
    window.startSettlement = startSettlement;
    window.calculateSettlementResult = calculateSettlementResult;
    window.calculateEndingAndRedirect = calculateEndingAndRedirect;
    window.handleMapDiscard = handleMapDiscard;
    window.recordDiscoveredEnding = recordDiscoveredEnding;
}