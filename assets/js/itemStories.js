// 所有物品的故事数据
const itemStories = {
    "crown": {
        name: "皇冠",
        description: "象征王权的物品，通常由国王佩戴。",
        story: "这顶皇冠是王室的传承之物，上面镶嵌着无数珍贵的宝石。每一位国王登基时都会佩戴它，以显示至高无上的权力。"
    },
    "pearl-pass": {
        name: "珍珠通关信物",
        description: "一枚镶嵌珍珠的信物，用于在皇宫内通行无阻。",
        story: "这枚珍珠信物是皇宫守卫的通行证，有了它可以在皇宫里通行无阻。信物上有一颗大珍珠，光彩夺目价值连城。"
    },
    "money": {
        name: "金钱",
        description: "一袋金币。",
        story: "这可不是什么普普通通的金币。这是克劳狄斯登基后铸造的新币，人们称为克劳狄斯的币。这是多少人渴望而不敢求的东西。"
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
    }
};

// 将英文物品键名转换为中文名称的函数
function getItemDisplayName(itemKey) {
    return itemStories[itemKey] ? itemStories[itemKey].name : itemKey;
}

// 导出给全局使用
window.itemStories = itemStories;
window.getItemDisplayName = getItemDisplayName;