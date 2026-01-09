// 角色数据
const characters = {
	"claudius": {
		name: "克劳狄斯",
		title: "国王",
		publicDescription: "老国王的弟弟丹麦王，街头巷尾流传着他娶了嫂嫂为妻的传闻",
		description: "你是丹麦王克劳狄斯，这王位本是你哥哥的。一场阴谋让他命丧黄泉。这深宫里，藏着你的秘密，那是你最深的恐惧。",
		initialItems: ["皇冠", "珍珠通关信物", "金钱"],
		goal: "毒死持有证据的人",
		goalKey: "prevent_conspiracy",
		backstory: "你的王位来路不正，这可千万不能让人知道。当年的知情人已经不多了，仅剩最后一件证据还流落民间。你决定利用这个案件，借机销毁证据。"
	},
	"chengying": {
		name: "程婴",
		title: "御医",
		publicDescription: "阴狠的御医，传闻是他害死了公孙杵臼",
		description: "天下人皆骂你，其实你卧薪尝胆，只为揭开当年的真相。",
		initialItems: ["中草药", "安眠药"],
		goal: "找到先王的死因",
		goalKey: "find_cure",
		backstory: "作为国王的御医，你探遍皇宫一无所获。但是年事已高，恐怕时日不多了。正巧这回国王下令彻查，你要趁着这个机会解开谜团。"
	},
	"hefei": {
		name: "何非",
		title: "潜水教练",
		publicDescription: "写作江湖百晓通，读作骗子",
		description: "你是个贪财好色之人，唯利是图但也遍交朋友。",
		initialItems: ["潜水装备", "骰子", "画具"],
		goal: "在三天内获取足够的钱还清赌债。",
		goalKey: "prove_identity",
		backstory: "克劳狄斯登基时，印了新头像的钱币。人人都知道，你最喜欢克劳狄斯的币了。"
	},
	"lixiang": {
		name: "李想",
		title: "市政排水总工程师",
		publicDescription: "负责皇宫排水系统设计的专业工程师。",
		description: "负责皇宫的排水系统设计。",
		initialItems: ["地下系统设计图"],
		goal: "找到尸体不是因排水系统设计有问题造成的死亡案件。",
		goalKey: "discover_secret",
		backstory: "作为排水系统的总工程师，要是设计问题造成了工匠死亡，那可是很严重的。你必须找出真相。"
	},
	"wuzhizhe": {
		name: "吴智哲",
		title: "建筑设计师",
		publicDescription: "年轻有为的建筑设计师，师从著名设计师。",
		description: "已故皇宫总建筑设计师的关门弟子。",
		initialItems: ["皇宫地面部分设计图", "导师手记"],
		goal: "找到师傅留下的秘密并保护它",
		goalKey: "protect_secret",
		backstory: "你的导师在去世前给你留下了手记，上面有一些奇怪的内容，似乎与先王有关。你知道它们很重要但并不清楚细节，决定一探真相。"
	},
	"wangweiguo": {
		name: "王卫国",
		title: "施工运输队队长",
		publicDescription: "经验丰富的施工运输队队长，管理着大量工人。",
		description: "负责施工运输的队长，掌握着物资和人员的流动。",
		initialItems: ["皇宫地图", "周报"],
		goal: "按时交付皇宫修建工程",
		goalKey: "stop_illegal_transport",
		backstory: "作为运输队队长，你的团队距离交付还剩三天。请找到修建所需的所有材料，保证皇宫按时交付。"
	}
};

// 导出给全局使用
window.characters = characters;