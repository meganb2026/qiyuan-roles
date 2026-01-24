// 角色数据
const characters = {
	"claudius": {
		name: "克劳狄斯",
		title: "国王",
		publicDescription: "老国王哈姆雷特的弟弟，他继位后娶了嫂嫂，当前最畅销的民间话本主人公",
		description: "你是丹麦王克劳狄斯，这王位本是你哥哥的。一场阴谋让他命丧黄泉。这深宫里，藏着你的秘密，那是你最深的恐惧。",
		initialItems: ["crown", "pearl-pass", "money"],
		goal: "取到证据，或找到当前持有证据的人并毒死",
		goalKey: "prevent_conspiracy",
		backstory: "你的王位来路不正，这可千万不能让人知道。当年的知情人已经不多了，仅剩最后一件证据还流落民间。你决定利用这个案件，借机销毁证据。",
		icon: "👑"
	},
	"chengying": {
		name: "程婴",
		title: "御医",
		publicDescription: "医术高超但风评阴狠的御医，传闻中就是他陷害死了公孙杵臼",
		description: "天下人皆骂你，其实你卧薪尝胆，只为揭开当年的真相。",
		initialItems: ["chinese-herbs", "sleeping-pill"],
		goal: "找到先王的死因",
		goalKey: "find_cure",
		backstory: "作为国王的御医，你探遍皇宫一无所获。但是年事已高，恐怕时日不多了。正巧这回国王下令彻查，你要趁着这个机会解开谜团。",
		icon: "⚕️"
	},
	"hefei": {
		name: "何非",
		title: "潜水教练",
		publicDescription: "消息灵通，八面玲珑。写作江湖百晓生，读作骗子",
		description: "你是个贪财好色之人，唯利是图但也遍交朋友。",
		initialItems: ["diving-equipment", "dice"],
		goal: "在三天内获取足够的钱还清赌债。",
		goalKey: "prove_identity",
		backstory: "克劳狄斯继位时，印了新头像的钱币。人人都知道，你最喜欢克劳狄斯的币了。",
		icon: "🏊"
	},
	"lixiang": {
		name: "李想",
		title: "市政排水总工程师",
		publicDescription: "给排水专家，代表作是完整的新城地下给排水设计",
		description: "负责皇宫的排水系统设计。",
		initialItems: ["underground-system-blueprint", "clothes"],
		goal: "找到尸体不是因排水系统设计有问题造成的死亡案件。",
		goalKey: "discover_secret",
		backstory: "作为排水系统的总工程师，要是设计问题造成了工匠死亡，那可是很严重的。你必须找出真相。",
		icon: "🔧"
	},
	"wuzhizhe": {
		name: "吴智哲",
		title: "建筑设计师",
		publicDescription: "已故王宫建筑总设计师的关门弟子",
		description: "无知者无畏，你是吴智哲。",
		initialItems: ["palace-ground-blueprint", "mentor-notes"],
		goal: "在三天内解出导师留下的线索并保护秘密",
		goalKey: "protect_secret",
		backstory: "你的导师在去世前给你留下了手记，里面有一些神秘的流水图案。你遍寻不着思路，决定趁此机会来皇宫碰碰运气。",
		icon: "📐"
	},
	"wangweiguo": {
		name: "王卫国",
		title: "施工运输队队长",
		publicDescription: "经验丰富的运输队长，带领团队每天穿梭于王宫运输材料",
		description: "你的团队每天穿梭于皇宫运输材料，每天皇宫里发生了什么新鲜事你都知道。",
		initialItems: ["palace-map", "weekly-report"],
		goal: "按时交付皇宫修缮工程",
		goalKey: "stop_illegal_transport",
		backstory: "作为运输队队长，你的团队距离交付还剩三天。请找到修缮所需的所有材料，保证皇宫按时交付。",
		icon: "🚛"
	}
};

// 导出给全局使用
window.characters = characters;