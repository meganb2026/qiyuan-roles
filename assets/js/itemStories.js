// 所有物品的故事数据
const itemStories = {
    "crown": {
        name: "大珍珠权杖",
        description: "象征王权的物品，通常由国王佩戴。",
        story: "这枚权杖是皇权的象征，每一位国王都会持有它，显示至高无上的权力。现任国王克劳狄斯更是给它镶嵌了独一无二的大珍珠。"
    },
    "pearl-pass": {
        name: "通关信物",
        description: "一枚通关信物，用于在皇宫内通行无阻。",
        story: "这枚信物是皇宫守卫的通行证，有了它可以在皇宫里通行无阻。"
    },
    "money": {
        name: "金钱",
        description: "一袋金币。",
        story: "这可不是什么普普通通的金币。这是克劳狄斯继位后铸造的新币，人们称为克劳狄斯的币。这是多少人渴望而不敢求的东西。"
    },
    "chinese-herbs": {
        name: "中草药",
        description: "里面是一支人参。",
        story: "说是甘草、桔梗和薄荷，经御医的手却变成了人参。莫非这程婴其实是女巫？"
    },
    "sleeping-pill": {
        name: "安眠药",
        description: "能让人深度睡眠的药物。",
        story: "拜托拜托，这是西药，而唯一的御医程婴明明是个老中医。告诉你一个秘密吧，他不吃这个药就会变成猫头婴，知道夜里皇宫里发生了什么。药盒上有标记，这正是出事前一夜他没吃的药。"
    },
    "diving-equipment": {
        name: "潜水装备",
        description: "专业的潜水工具，包括氧气瓶、潜水服等。",
        story: "何非此人虽然四六不着，但正经是个潜水高手。有了他的潜水装备，你可以探入水底自由潜行。"
    },
    "dice": {
        name: "骰子",
        description: "一副普通的赌博骰子。",
        story: "什么人会带骰子在身上？赌徒？"
    },
    "clothes": {
        name: "羽绒服内胆",
        description: "红的黄的绿的黑的白的...长袖短袖...翻开一件羽绒服下面还有一件",
        story: "谁见了都要问一句：叔叔，这对吗？"
    },
    "underground-system-blueprint": {
        name: "地下系统设计图",
        description: "皇宫地下水道和排污系统的完整设计图纸。",
        story: "这张设计图是李想的心血之作，详细标注了皇宫地下系统的每一个角落。图纸上不仅有水道的走向，还有许多隐藏的密室和暗道。这些密道曾经被用来运送什么，这可不好说。你有了这张图，倒也可以试试走水路。"
    },
    "palace-ground-blueprint": {
        name: "皇宫初版设计图",
        description: "皇宫地面建筑的详细设计图纸。",
        story: "这是吴智哲和同门们画的初版设计图，记录了皇宫的每一个角落。图纸上标注了许多不为人知的机关和密道。不过因为经历过几次修缮，已经有一部分不准确了。"
    },
    "mentor-notes": {
        name: "导师手记",
        description: "已故建筑设计师留下的笔记和心得。",
        story: "这本手记记录了吴智哲导师一生的建筑心得，其中有很多流水的标识。最后一页画着一张图，似乎是一扇门，它在水下。"
    },
    "palace-map": {
        name: "皇宫运输地图",
        description: "皇宫的运输地图，标注了所有重要位置。",
        story: "这张地图是王卫国的必备工具，他需要用它来规划施工路线和物资运输。不过这上面只有能用于货物运输的大路。"
    },
    "weekly-report": {
        name: "工作周报",
        description: "施工队的每周工作报告。",
        story: "这份周报记录了施工队的每一项工作进度和发现。根据这份周报记录，出事的地方沿路都是运输队每天的必经之地。"
    },
    "half-piece-curtain": {
        name: "半块窗帘布",
        description: "和克劳狄斯的袍子的材质一模一样，上面甚至还有挂窗帘用的钩子。",
        story: "看着像窗帘布，实际还真是窗帘布。"
    },
    "scratcher": {
        name: "痒痒挠",
        description: "一个痒痒挠，看着很趁手的样子。",
        story: "如果有谁的胳肢窝下有两个洞的话，就更适配了。"
    },
    "letter": {
        name: "信封",
        description: "里面有一张海鲜自助餐券，还有一张贺卡，上面写着“老公，我不要吃牛排，我要吃海鲜。今晚，让我们一起喝醉诶诶诶诶！”",
        story: "案发后这里被仔细检查过，这个信封应该是昨晚有人不小心掉在这里，又结了霜才变成的冰块。这里谁有老婆还会去自助餐厅？不对，过期日期是几年前…"
    },
    "picture": {
        name: "老照片",
        description: "照片上赫然是运输队队长王卫国。",
        story: "奇怪，他的嘴巴微微张开，他的眉头紧蹙，眼睛却被一块红布遮盖看不清神情。他仰着头露出脖子，像是被什么人挟持了一样？"
    },
    "one-line-of-code": {
        name: "一行代码",
        description: "冰化了，里面飘出了一行代码：",
        story: "“烫烫烫烫烫烫烫烫烫”"
    },
    "primer": {
        name: "隔离霜",
        description: "玻璃杯里放着一支隔离霜。",
        story: "原来是郑棋元老师2025年全新单曲《悲观隔离》。已全平台上线，期待您的收听。"
    },
    "ice": {
        name: "一块寒冰",
        description: "横看是一块寒冰，竖看是一块寒冰。",
        story: "你看它像什么？一块寒冰。"
    },
    "map": {
        name: "梦魇的地图",
        description: "地图上一共有八个地点，分别是上海文化广场、北京保利剧院、克劳狄斯的寝宫、程婴的药房、何非的卧室、王卫国的宿舍、李想的书房和吴智哲的客厅。它们有一些相邻关系。",
        story: "当你的位置移动，相邻地点会随之改变。时间有限，只能前进无法后退。这意味着每当选择了一个地点，就要放弃上一个地点的临近地点。"
    },
    "flashlight": {
        name: "手电筒",
        description: "当你不能看见黑暗欺压星光时，打开手电筒可以把世界照亮。",
        story: "它能照亮无法触及的黑暗。"
    }
};

// 将英文物品键名转换为中文名称的函数
function getItemDisplayName(itemKey) {
    return itemStories[itemKey] ? itemStories[itemKey].name : itemKey;
}

// 导出给全局使用
window.itemStories = itemStories;
window.getItemDisplayName = getItemDisplayName;