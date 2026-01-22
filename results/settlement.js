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
        // 使用相对路径，确保从任何页面调用都能正确解析
        // 检查当前路径是否已经在results目录下
        const currentPath = window.location.pathname;
        if (currentPath.includes('/results/')) {
            // 已经在results目录下，直接使用文件名
            window.location.href = 'dice-decision.html?character=' + currentCharacter;
        } else {
            // 不在results目录下，使用完整路径
            window.location.href = 'results/dice-decision.html?character=' + currentCharacter;
        }
        return;
    }
    
    // 直接跳转到结算页面
    // 使用相对路径，确保从任何页面调用都能正确解析
    // 检查当前路径是否已经在results目录下
    const currentPath = window.location.pathname;
    if (currentPath.includes('/results/')) {
        // 已经在results目录下，直接使用文件名
        window.location.href = 'settlement.html?character=' + currentCharacter;
    } else {
        // 不在results目录下，使用完整路径
        window.location.href = 'results/settlement.html?character=' + currentCharacter;
    }
}

// 计算结算结果
function calculateSettlementResult(currentCharacter = 'claudius', from = '') {
    // 检查是否是从骰子页面跳转过来的
    if (from === 'dice') {
        return {
            title: '你失败了',
            content: '敢把命运交给骰子，你才是真的何非。'
        };
    }
    
    // 检查是否是丢弃地图导致的失败
    if (from === 'map-discard') {
        return {
            title: '你失败了',
            content: '失去了地图的你迷路了。'
        };
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
    // 1. 非Claudius角色，同时拥有crown和half-piece-curtain
    if (actualCharacter !== 'claudius' && inventory.includes('crown') && inventory.includes('half-piece-curtain')) {
        return {
            title: '你登基了',
            content: '你查了半块窗帘布的出处，克劳狄斯穿的“黄袍”竟真是窗帘布。看着手上的权杖，你福至心灵。'
        };
    }
    
    // 2. 非Claudius角色，拥有scratcher
    if (actualCharacter !== 'claudius' && inventory.includes('scratcher')) {
        return {
            title: '你成功了',
            content: '大家都没有找到凶手，克劳狄斯听说了勃然大怒。你看了看痒痒挠，决定得挠人处且挠人。你挠了挠他，他笑了。'
        };
    }
    
    // 3. Claudius或何非，拥有primer
    if ((actualCharacter === 'claudius' || actualCharacter === 'hefei') && inventory.includes('primer')) {
        return {
            title: '你成功了',
            content: '你把隔离霜涂在脸上，它假白。你被洗白了。'
        };
    }
    
    // 生成个性化消息和标题
    const result = generatePersonalizedMessage(actualCharacter, inventory);
    
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
                    content: '一定有什么不符合常理的。等等，李想那小子不是每天穿风衣吗，为什么有这么多羽绒服？原来他是哈姆雷特易容的，穿羽绒服是因为要到英格兰去。'
                };
            } else if (inventory.includes("mentor-notes")) {
                return {
                    title: '你成功了',
                    content: '你找到了篡位的证据，原来藏在吴智哲老师的手稿里。你偷偷销毁了它，至于那个傻小子，呵。'
                };
            } else {
                return {
                    title: '你失败了',
                    content: '你当年篡位的证据被发现并公之于众。天下皆惊竟有人为了皇位弄死自己的兄长，你被愤怒的人们处死。'
                };
            }
        case "chengying":
             if (inventory.includes("diving-equipment")) {
                return {
                    title: '你成功了',
                    content: '你不顾寒冷，穿着潜水服跳进下水道找到了克劳狄斯谋反的证据。下水道虽窄，你的义举犹如一人渡过了七条大河。'
                };
            } else if (inventory.includes("mentor-notes")) {
                return {
                    title: '你成功了',
                    content: '你仔细辨认吴智哲老师的手稿，猜到了藏匿秘密的地方，并告诉了吴智哲。吴智哲无谓，不怕冬天的下水道有多冷，跳下去找到了克劳狄斯谋反的证据。'
                };
            } else {
                return {
                    title: '你失败了',
                    content: '你没有找到克劳狄斯谋反的证据。众人也没有找到凶杀案的真凶。'
                };
            }
        case "hefei":
            if (inventory.includes("weekly-report")) {
                return {
                    title: '你成功了',
                    content: '你在周报中敏锐地发现材料运输数量减少的问题，编造了一个故事，说是李想的设计有问题王卫国他们替他遮掩了，成功嫁祸李想和王卫国。克劳狄斯因此给你了一笔钱。'
                };
            } else if (inventory.includes("pearl-pass")) {
                return {
                    title: '你成功了',
                    content: '通关令牌这东西没什么用啊…不过对有些人来讲是有用的。你把令牌卖给王卫国，让他的施工队可以继续施工不受案情影响，拿到的钱还清了赌债。'
                };
            } else if (inventory.includes("flashlight")) {
                return {
                  title: '你失败了',
                  content: '大家都没有头绪。克劳狄斯问，你不是要让他眼前一亮吗？你打开了手电筒。'
                };
            } else if (inventory.includes("crown")) {
                return {
                    title: '你失败了',
                    content: '你没有凑够钱，把目光移向了手上的珍珠想要卖了换钱。可恶克劳狄斯竟然给珍珠下毒，你被毒死了。'
                };
            } else {
                return {
                    title: '你失败了',
                    content: '你没有凑够钱。加之所有人都没有找到元凶，克劳狄斯大怒觉得你耍他，把你处死了。'
                };
            }
        case "lixiang":
            if (inventory.includes("sleeping-pill")) {
                return {
                    title: '你成功了',
                    content: '你拿着安眠药去找了程婴，他告诉你前一夜皇宫上天降暴雨。这恰好证明下水道系统排水很好所以第二天没有看到水。至于尸体，不是淹死的，说明和下水道设计无关。'
                };
            } else if (inventory.includes("weekly-report")) {
                return {
                    title: '你成功了',
                    content: '王卫国的周报里记录了每周的工作。上面记录了下水道在发大水时快速排水。至于尸体，不是淹死的，说明和下水道设计无关。'
                };
            } else {
                return {
                    title: '你失败了',
                    content: '时间到了，你没能证明下水道设计没有问题。何非编造了一个故事，让克劳狄斯把你处死了。'
                };
            }
        case "wangweiguo":
            if (inventory.includes("pearl-pass")) {
                return {
                    title: '你成功了',
                    content: '你拿着通关令牌让兄弟们顺利继续施工，成功结算回家过了一个好年。至于凶杀案，听说克劳狄斯找到了元凶。'
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
    
    // 跳转到结算页面，并传递失败原因
    // 使用相对路径，确保从任何页面调用都能正确解析
    // 检查当前路径是否已经在results目录下
    const currentPath = window.location.pathname;
    if (currentPath.includes('/results/')) {
        // 已经在results目录下，直接使用文件名
        window.location.href = 'settlement.html?character=' + currentCharacter + '&from=map-discard';
    } else {
        // 不在results目录下，使用完整路径
        window.location.href = 'results/settlement.html?character=' + currentCharacter + '&from=map-discard';
    }
}

// 为了兼容性，添加到全局对象
if (typeof window !== 'undefined') {
    window.startSettlement = startSettlement;
    window.calculateSettlementResult = calculateSettlementResult;
    window.handleMapDiscard = handleMapDiscard;
}