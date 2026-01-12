// 物品数据和目标检查逻辑

// 检查角色目标是否完成
function checkGoal(playerInventory, selectedCharacter, currentDay) {
    const goalCheckers = {
        "claudius": function(inventory) {
            // 克劳狄斯（国王）：需要珍珠通关信物 + 至少两个其他关键物品
            if (!inventory.includes("通关信物")) return false;

            const keyItems = ["导师手记", "工作周报", "地下系统设计图", "皇宫地面部分设计图", "皇宫地图"];
            let count = 0;
            keyItems.forEach(item => {
                if (inventory.includes(item)) count++;
            });
            return count >= 2;
        },

        "chengying": function(inventory) {
            // 程婴（御医）：需要中草药 + 安眠药 + 至少一个其他线索
            if (!inventory.includes("中草药") || !inventory.includes("安眠药")) return false;

            const clueItems = ["导师手记", "地下系统设计图", "工作周报"];
            return clueItems.some(item => inventory.includes(item));
        },

        "hefei": function(inventory) {
            // 何非（潜水教练）：需要潜水装备 + 至少两个其他关键物品
            if (!inventory.includes("潜水装备")) return false;

            const keyItems = ["地下系统设计图", "导师手记", "皇宫地图", "工作周报", "通关信物"];
            let count = 0;
            keyItems.forEach(item => {
                if (inventory.includes(item)) count++;
            });
            return count >= 2;
        },

        "lixiang": function(inventory) {
            // 李想（市政排水总工程师）：需要地下系统设计图 + 至少两个其他线索
            if (!inventory.includes("地下系统设计图")) return false;

            const clueItems = ["工作周报", "导师手记", "皇宫地图", "皇宫地面部分设计图"];
            let count = 0;
            clueItems.forEach(item => {
                if (inventory.includes(item)) count++;
            });
            return count >= 2;
        },

        "wuzhizhe": function(inventory) {
            // 吴智哲（建筑设计师）：需要皇宫地面部分设计图 + 导师手记 + 至少一个其他物品
            if (!inventory.includes("皇宫地面部分设计图") || !inventory.includes("导师手记")) return false;

            const otherItems = ["地下系统设计图", "工作周报", "皇宫地图"];
            return otherItems.some(item => inventory.includes(item));
        },

        "wangweiguo": function(inventory) {
            // 王卫国（施工运输队队长）：需要皇宫地图 + 周报 + 至少一个其他线索
            if (!inventory.includes("皇宫地图") || !inventory.includes("工作周报")) return false;

            const clueItems = ["地下系统设计图", "导师手记", "通关信物"];
            return clueItems.some(item => inventory.includes(item));
        }
    };

    return goalCheckers[selectedCharacter] ? goalCheckers[selectedCharacter](playerInventory) : false;
}

// 获取游戏结局
function getGameEnding(goalCompleted, currentDay) {
    if (goalCompleted) {
        return {
            type: 'success',
            title: '🎉 成功！',
            message: '经过三天的努力，你成功完成了你的目标！'
        };
    } else if (currentDay >= 3) {
        return {
            type: 'failure',
            title: '❌ 失败',
            message: '三天过去了，你未能完成你的目标。'
        };
    } else {
        return {
            type: 'continue',
            title: '继续游戏',
            message: '你还需要更多线索来完成目标。'
        };
    }
}

// 导出函数
window.checkGoal = checkGoal;
window.getGameEnding = getGameEnding;