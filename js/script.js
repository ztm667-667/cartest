/**
 * ================================================================
 * CARTI - 座驾人格测试
 * 核心脚本
 *
 * 目录：
 *   1. 车辆数据库（cars）
 *   2. MBTI 人格解读数据库（mbtiExplanations）
 *   3. 题目数据库（questions）
 *   4. 测试状态
 *   5. 核心函数（showPage / startQuiz / renderQuestion
 *              / selectOption / calculateMBTI / showResult
 *              / retry / shareResult）
 * ================================================================ */

/* ================================================================
 * 1. 车辆数据库
 * ================================================================
 * 16 辆车，每辆对应唯一的 MBTI 类型。
 * description 融合了：
 *   1. 真实车辆参数（引擎/排量/驱动形式）
 *   2. Forza Horizon 5 中的定位与操控特性
 *   3. 与 MBTI 性格的天然契合度
 * ================================================================ */
const cars = [
  {
    mbti: 'INFP', name: 'Toyota Supra RZ (1998)', category: '🇯🇵 JDM 传奇',
    image: 'image/Toyota Supra RZ (1998).jpg',
    tags: ['低调实力派', '改装潜力无限', 'JDM 图腾'],
    description: '2JZ-GTE 直列六缸涡轮增压，低调的实力派。直线不快，但底子深不见底——你永远不知道这台车极限在哪，因为它根本没有明显短板。深藏不露的人开深藏不露的车，天经地义。\n\n在 FH5 里，Supra 的调校宽容度极高：涡轮延迟可控、车身重量分布均衡、尾部动态可预测。无论你是追求极限圈速还是享受巡航，它都能完美配合你当下的情绪。这种「没有性格」的性格，恰恰是 INFP 内心最渴望的自由。'
  },
  {
    mbti: 'ISFP', name: 'Nissan Skyline GT-R V-Spec (1997)', category: '🇯🇵 JDM 传奇',
    image: 'image/Nissan Skyline GT-R V-Spec (1997).jpg',
    tags: ['四驱王者', '拉力精神', '精准循迹'],
    description: 'RB26DETT 双涡轮增压直列六缸，ATTESA-ETS 超级四驱。每一个弯道都像在执行精密战略，车尾的循迹性如同长了眼睛。战略型人格的首选座驾。\n\n在 FH5 里，R34 的四驱系统在出弯加速时稳如老狗，涡轮起压后中段加速力道源源不断。它的性格是「克制」——不张扬、不暴躁，但每一步都精准得分。这种隐忍的力量感，和 ISFP 外柔内刚的特质高度吻合。'
  },
  {
    mbti: 'ENFP', name: 'Mazda RX-7 Spirit R (2002)', category: '🇯🇵 JDM 传奇',
    image: 'image/Mazda RX-7 Spirit R (2002).jpg',
    tags: ['转子浪漫', '人马合一', '高转速艺术'],
    description: '13B-REW 双转子自然吸气发动机，不可复制的浪漫。没有活塞引擎的暴躁，旋转的转子带来独特的嘶吼音。懂它的人爱到骨子里，不懂的人只觉得吵。\n\n在 FH5 里，RX-7 是那种「人车合一」体验最深的车型之一——超高的转速红线、轻盈的车身、敏锐的车尾动态，都在说同一句话：「我为你而生。」对于永远在寻找新鲜感的 ENFP，它永远都有惊喜。'
  },
  {
    mbti: 'INTP', name: 'Honda NSX-R (2002)', category: '🇯🇵 JDM 传奇',
    image: 'image/Honda NSX-R (2005).jpg',
    tags: ['工程极致', '中置后驱', '机械对话'],
    description: 'C30A 3.0L V6 VTEC 高转速引擎，工程思维的极致。它不是最快的，但每个设计决策都无比清醒。精准、克制、毫无冗余——纯理性的浪漫。\n\n在 FH5 里，NSX-R 是一台需要你全神贯注的车：没有四驱的辅助，没有涡轮的蛮力，只有你和机械之间最直接的对话。弯道里每一次轮胎尖叫都是数据，每一次推头都是对你入弯角度的修正。这台车让驾驶变成一门科学，而 INTP 最擅长的就是科学。'
  },
  {
    mbti: 'ESTJ', name: 'Mitsubishi Lancer Evolution VI (1999)', category: '🇯🇵 JDM 传奇',
    image: 'image/Mitsubishi Lancer Evolution VI GSR (1999).jpg',
    tags: ['拉力王者', '四驱稳定', '指令执行'],
    description: '4G63 涡轮增压器 + AYC 主动偏航控制，拉力赛场上的常胜将军。指令清晰、执行坚决、从不犹豫。车手和车之间建立起的信任感无可替代。\n\n在 FH5 里，EVO VI 是那种「你说什么它就做什么」的车——四驱咬地、涡轮响应快、刹车有力、车身稳如轨道车。ESTJ 喜欢掌控感，而 EVO 把控制权完全交还给你，不多不少。这种恰到好处的互动，是 ESTJ 效率至上哲学的完美体现。'
  },
  {
    mbti: 'ENTJ', name: 'Subaru WRX STI SuperCar (2018)', category: '🇯🇵 JDM 传奇',
    image: 'image/Subaru  WRX STI SuperCar (2018).jpg',
    tags: ['水平对置', '涡轮响应', '命令机器'],
    description: '水平对置 2.0L 涡轮增压 + SI-DRIVE 驾驶管理系统，SUBARU 的性能图腾。命令系统清晰无比，涡轮介入时的拉扯感让人上瘾。\n\n在 FH5 里，WRX STI 是一部「指令-执行」闭环极其紧凑的机器。你给出方向，它给出抓地力；你给油门，它给加速；你给刹车，它给稳定。ENTJ 是那种讨厌等待答案的人，而 STI 的响应速度从不让人失望。这种「说到做到」的性格，是 ENTJ 在公路和赛道上最可靠的武器。'
  },
  {
    mbti: 'ENTP', name: 'Ford SVT Cobra R (2000)', category: '🇺🇸 美式肌肉',
    image: 'image/Ford SVT Cobra R (1993).jpg',
    tags: ['暴力美学', 'V8机械增压', '多面手'],
    description: 'V8 5.4L 机械增压，暴力美学的代表作。马力不是用来炫的，是用来压弯的。在大尾翼和泄压阀的轰鸣里，藏着多面手的灵魂。\n\n在 FH5 里，SVT Cobra R 的调校风格本身就是一个话题——是降赛道还是跑直线？是保持原厂还是深度改装？这台车强迫你做选择，而 ENTP 最讨厌的就是没有选择。这台车的「未完成感」是故意的，它在等你给它一个定义。'
  },
  {
    mbti: 'ESFP', name: 'Chevrolet Corvette Z06 (2019)', category: '🇺🇸 美式肌肉',
    image: 'image/Chevrolet Corvette Z06 (2002).jpg',
    tags: ['国宝超跑', 'V8高转声浪', '全场焦点'],
    description: 'LT6 6.2L V8 自然吸气，670 马力的国宝级超跑。线条张狂，声浪粗粝，开它上路没有人能忽视你的存在。\n\n在 FH5 里，C8 Corvette Z06 是那种「我站在这里就是全场焦点」的存在。中置引擎的完美比例、V8 高转的嘶吼、赛道模式的硬核悬挂——每一项配置都在说同一句话：「看着我。」ESFP 生来就是要被看见的，而 Corvette Z06 让这件事变得毫不费力。'
  },
  {
    mbti: 'ISTP', name: 'Bone Shaker (2011)', category: '🇺🇸 美式肌肉',
    image: 'image/Bone Shaker (2011).jpg',
    tags: ['定制肌肉', '机械直接感', '原始快感'],
    description: '定制大排量肌肉车，无需多余解释。纯粹的机械快感，没有电子系统的过度修饰。每次加速都是对平庸的宣战。\n\n在 FH5 里，Bone Shaker 是那种「原始」的存在——它不需要驾驶模式选择，不需要牵引力控制微调，它只需要你踩下油门，然后把方向交给本能。ISTP 讨厌被复杂系统束缚，而 Bone Shaker 的机械直接感，是一种解放。'
  },
  {
    mbti: 'ESTP', name: 'Lamborghini Sesto Elemento (2010)', category: '🇮🇹 意大利烈马',
    image: 'image/Lamborghini Sesto Elemento (2011).jpg',
    tags: ['全碳车身', '赛道武器', '轻量化极致'],
    description: '全碳纤维车身，V10 5.0L 自然吸气发动机，赛道武器级别的轻量化设计。0-100 只需 2.5 秒，车尾的下压力让你贴地飞行。\n\n在 FH5 里，Sesto Elemento 是那种「危险但让人欲罢不能」的存在——四驱稳稳咬住地面、V10 高转声音摄人心魄、碳纤维车身让推重比接近极致。ESTP 热爱风险，而 Sesto Elemento 把风险变成一门艺术。这台车告诉你：极限不是边界，是游乐场。'
  },
  {
    mbti: 'ENFJ', name: 'Ferrari F40 (1987)', category: '🇮🇹 意大利烈马',
    image: 'image/Ferrari F40 (1987).jpg',
    tags: ['传奇图腾', '双涡轮', '公路感染力'],
    description: '双涡轮 V8 2.9L，480 马力的图腾级存在。设计者恩佐·法拉利亲自监督完成，一台传奇，一段历史，一种信仰。\n\n在 FH5 里，F40 是那种「你一出现所有人都在看你」的存在。标志性的双尾翼、钛合金换挡拨片、无内饰的赛道基因——每一处设计都在宣告：这是为驾驶者造的车。ENFJ 天生具有让周围人兴奋的能力，而 F40 是公路上最具感染力的存在。'
  },
  {
    mbti: 'ISTJ', name: 'Porsche 911 Turbo 3.3 (1982)', category: '🇩🇪 德系性能',
    image: 'image/Porsche 911 Turbo 3.3 (1982).jpg',
    tags: ['风冷经典', '德式精准', '永恒可靠'],
    description: '风冷后置发动机，360 马力的「德式精准」。性能强悍但性格保守，稳定得像一台德系轿车，却能在赛道上掀翻一片超跑。\n\n在 FH5 里，911 Turbo 是那种「你永远可以相信它」的存在。四驱系统给你信心、涡轮迟滞可控、刹车线性而有力。ISTJ 欣赏可靠性，而这款 911 Turbo 正是可靠性的定义。它的性格不是「刺激」，而是「永恒」——每一次驾驶都稳定得分，从不让主人失望。'
  },
  {
    mbti: 'INFJ', name: 'Bugatti Divo (2019)', category: '🇩🇪 德系性能',
    image: 'image/Bugatti Divo (2019).jpg',
    tags: ['马力巨兽', '赛道艺术', '追求极致'],
    description: 'W16 四涡轮增压 8.0L，1500 马力的赛道宣言。0-100 只需 2.4 秒，极速 380km/h。这是大众集团给赛道玩家的终极献礼，全球仅 40 辆。\n\n在 FH5 里，Divo 不是一辆车，是一件艺术品。它代表了一种不惜代价追求极致的造车哲学——更窄的轮胎带来更锐利的弯道表现、更强的空气下压力让高速稳定性达到另一个层次。INFJ 内心深处渴望意义，而 Divo 代表的是人类对机械极限永不停歇的追问。'
  },
  {
    mbti: 'INTJ', name: 'McLaren F1 GT (1997)', category: '🇩🇪 德系性能',
    image: 'image/Mclaren F1 GT (1997).jpg',
    tags: ['中置驾驶舱', '颠覆设计', '原创性爆表'],
    description: '颠覆性的中置驾驶座设计，BMW V12 6.1L 发动机，领先时代 20 年的作品。每一次出现都像从未来穿越回来。\n\n在 FH5 里，F1 GT 是那种「你看到它就知道这不一样」的存在。中置驾驶座让你成为车的一切核心、宽大的前风挡提供赛车手视野、V12 高转引擎的声浪宛如天籁。INTJ 欣赏原创性，而 F1 GT 是汽车工业史上最具原创性的作品之一。这台车不需要解释，它本身就是答案。'
  },
  {
    mbti: 'ESFJ', name: 'Hoonigan Ford RS200 Evolution (1987)', category: '🚗 热门特殊车辆',
    image: 'image/Hoonigan Ford RS200 Evolution (1986).jpg',
    tags: ['B组拉力遗产', '宽体套件', '集体回忆'],
    description: 'B组拉力遗产，RS200 的狂热改装版本。宽体套件和夸张的尾翼让它成为全场最有个性的存在，集体回忆制造机。\n\n在 FH5 里，RS200 Evo 是那种「停在车房里你就会多看两眼」的车——拉力赛 heritage、宽体、B 组的名字加持，每个元素都在诉说一段传奇。ESFJ 珍视连接与归属，而这款车代表的是一整代拉力迷共同的记忆和热情。'
  },
  {
    mbti: 'ISFJ', name: 'BMW Isetta (1957)', category: '🚗 热门特殊车辆',
    image: 'image/BMW Isetta (1957).jpg',
    tags: ['泡泡车传奇', '复古可爱', '无攻击性魅力'],
    description: '泡泡车设计的极致代表，0.6L 单缸风冷引擎，前置单门。娇小、可爱、过目不忘。在一堆性能猛兽中，它是让人会心一笑的存在。\n\n在 FH5 里，Isetta 是那种「你开它没人会觉得你炫富」的车——它可爱、独特、毫无威胁感，却总能引发最友善的关注。ISFJ 不喜欢被聚焦，但喜欢创造温暖的氛围，而 Isetta 正是这种「不带攻击性的魅力」的最佳代表。'
  }
];

/* ================================================================
 * 2. MBTI 人格解读数据库
 * ================================================================
 * 每种 MBTI 包含：
 *   - 人格类型标题 + emoji
 *   - 核心性格描述（2-3段）
 *   - 💪 优势 / ⚠️ 盲点 / 🏁 适合风格
 *
 * 类型分组：
 *   Analysts  · INTJ/INTP/ENTJ/ENTP — 分析师：逻辑、战略、创意
 *   Diplomats  · INFJ/INFP/ENFJ/ENFP — 外交家：共情、理想、信念
 *   Sentinels  · ISTJ/ISFJ/ESTJ/ESFJ — 守护者：稳定、责任、协作
 *   Explorers  · ISTP/ISFP/ESTP/ESFP — 探险家：感受、适应、行动
 * ================================================================ */
const mbtiExplanations = {
  'INTJ': '建筑大师人格 🏛️\n\n你是那种脑子里同时跑着三套方案的人。在别人还在想第一步怎么走的时候，你已经把终局推演完了。你不需要别人认可你的路线——因为你的路线往往是对的。\n\n\n💪 优势：战略思维、逻辑严谨、独立决策\n⚠️ 盲点：过于苛求完美，忽视团队情感需求\n🏁 适合风格：精确走线、刷新极限、数据分析',
  'INTP': '逻辑学家人格 🔬\n\n你是那种会把引擎盖打开研究半小时的人。选车不是选样子，是选底层逻辑。你享受理解一个系统如何工作的过程，而不是驾驭它炫耀给别人看。\n\n\n💪 优势：分析能力强、思维深度、专注研究\n⚠️ 盲点：行动力偏弱，容易陷入过度分析\n🏁 适合风格：技术调校、长途驾驶、研究特性',
  'ENTJ': '指挥官人格 ⚔️\n\n你是天生的车队领袖。目标清晰、指令简洁、执行力拉满。赛道上你不需要解释为什么要超这辆车——队友只需要跟上你就够了。\n\n\n💪 优势：决策果断、组织力强、目标导向\n⚠️ 盲点：强势且耐心不足，容易忽视他人感受\n🏁 适合风格：拉力冲刺、车队编队、竞速对抗',
  'ENTP': '辩论家人格 💡\n\n你是车房里最烦人的那个——也是最有趣的那个。你永远在问"为什么不"，永远在找漏洞，永远在提出疯狂的主意然后把它变成现实。\n\n\n💪 优势：创意无限、反应迅速、社交能力强\n⚠️ 盲点：三分钟热度，执行力飘忽\n🏁 适合风格：整活改装、社交活动、创意跑法',
  'INFJ': '倡导者人格 🌌\n\n你是那种带着使命感坐进驾驶座的人。你选的车要有灵魂，要有意义。驾驶对你来说不是到达终点，是一场与车对话的修行。\n\n\n💪 优势：洞察力强、坚持理想、行动有使命感\n⚠️ 盲点：过于理想化，不切实际\n🏁 适合风格：长途驾驶、沉淀思考、追求人车合一',
  'INFP': '调停者人格 🌸\n\n你是那种会在赛车里听一首慢歌、想着"这辆车真的好美"的人。你选车不靠参数，靠感受。车不只是机器，它有自己的灵魂和故事。\n\n\n💪 优势：感受力丰富、理想主义、忠诚度高\n⚠️ 盲点：容易犹豫，过于活在自己的世界里\n🏁 适合风格：优雅巡航、拍照兜风、享受独处时光',
  'ISFJ': '守卫者人格 🛡️\n\n你是那种默默把一切照顾好的人。在赛道日你会提前帮队友检查轮胎胎压，记得住每个人的喜好。你不追求聚光灯，但所有人都离不开你。\n\n\n💪 优势：责任心强、注重细节、忠诚可靠\n⚠️ 盲点：不善于拒绝，过于谦让\n🏁 适合风格：后勤保障、稳定巡航、默默付出',
  'ISFP': '探险家人格 🧭\n\n你是那种会在山路上停下来拍照的人。速度不是最重要的，美才是。你选的车要好看，要有feel，要能让你在握住方向盘的瞬间忘掉所有烦恼。\n\n\n💪 优势：审美在线、适应力强、活在当下\n⚠️ 盲点：容易逃避冲突，过于随性\n🏁 适合风格：自驾游、风景巡航、随性探索',
  'ESTP': '企业家人格 🔥\n\n你是那种一脚油门踩到底然后再说的人。反应比思考快，车尾滑出去的瞬间才是你真正清醒的时候。风险是你最熟悉的游乐场。\n\n\n💪 优势：行动力爆表、危机处理能力、现实主义\n⚠️ 盲点：缺乏长期规划，容易冲动\n🏁 适合风格：漂移甩尾、短距离冲刺、极限操作',
  'ESFP': '表演者人格 🎭\n\n你是车房里永远不会无聊的那个人。你的车不只是代步工具，是你的舞台。大尾翼、引擎声浪、过弯的滑移角度——每一秒都要被看见。\n\n\n💪 优势：魅力四射、乐观开朗、行动力强\n⚠️ 盲点：注意力短暂，害怕负面评价\n🏁 适合风格：车友巡游、表演性驾驶、社交场合',
  'ESFJ': '供给者人格 🎁\n\n你是那种一出场就让人感觉温暖的人。你喜欢车房里热闹的氛围，喜欢和朋友们一起研究改装。你开车不是一个人的事——你享受和大家在一起的时光。\n\n\n💪 优势：热情周到、乐于助人、协调能力强\n⚠️ 盲点：过于在意他人看法，害怕冲突\n🏁 适合风格：组队出行、车友活动、氛围担当',
  'ESTJ': '执行者人格 📋\n\n你是那种把赛道日当成军事行动来执行的人。提前规划好每一圈的节奏，检查清单列得比任何人都详细，然后一丝不苟地执行到底。\n\n\n💪 优势：执行力强、责任心、注重效率\n⚠️ 盲点：缺乏灵活性，不善于应对突发变化\n🏁 适合风格：计时赛、稳定跑圈、赛道日规划',
  'ENFJ': '追星人格 ⭐\n\n你是那种能让整个车友群都活跃起来的人。你选的车也要够闪耀，够独特，能让你带着朋友们一起体验驾驶的快乐。你是人群中的光，也是方向盘前的王。\n\n\n💪 优势：领袖魅力、沟通能力强、富有感染力\n⚠️ 盲点：过于追求认可，可能忽视自我需求\n🏁 适合风格：车队领袖、社交巡游、公路旅行',
  'ENFP': '追梦者人格 🌈\n\n你是那种会在 Garage 里花三小时研究怎么把一辆车改成你认为最帅的样子，然后第二天又有了新灵感的人。你的车库永远没有"最终版本"。\n\n\n💪 优势：创意无限、热情积极、适应力强\n⚠️ 盲点：难以专注，讨厌重复性工作\n🏁 适合风格：个性改装、创意跑法、探索未知',
  'ISTJ': '物流师人格 📐\n\n你是那种把车辆手册背下来的人。1000公里保养、轮胎换位周期、机油型号——全都门清。你的车永远是最整洁的，你的圈速永远是最稳定的。\n\n\n💪 优势：可靠性强、注重细节、自律严格\n⚠️ 盲点：过于保守，不善于变通\n🏁 适合风格：精准计时、长途稳定性、日常驾驶',
  'ISTP': '匠艺师人格 🔧\n\n你是那种把车拆了再装回去的人。工程师思维，对机械结构有天然的痴迷。你享受的不只是开车，而是理解这台机器为什么能跑这么快。\n\n\n💪 优势：动手能力强、逻辑清晰、冷静理性\n⚠️ 盲点：不善表达情感，社交意愿偏低\n🏁 适合风格：技术调校、拆装研究、极限测试'
};

/* ================================================================
 * 3. 题目数据库
 * ================================================================
 * 共48题，覆盖MBTI四个维度：
 *   EI — 外向/内向（11题）：能量获取方式
 *   SN — 感觉/直觉（13题）：信息获取偏好
 *   TF — 思考/情感（13题）：决策方式
 *   JP — 判断/知觉（11题）：生活方式
 *
 * 计分规则：每个选项的 value（E/S/T/J）计入对应维度
 * ================================================================ */
const questions = [
  // ─────────────── EI（外向/内向）────────────────────────
  {
    dimension: 'EI', text: '跑完一场比赛，你第一件事是？',
    options: [
      { text: '找朋友复盘刚才那局，聊聊哪里可以更快', value: 'E' },
      { text: '自己默默回放练习，研究每一个弯道', value: 'I' }
    ]
  },
  {
    dimension: 'EI', text: '参加车友活动，你一般？',
    options: [
      { text: '主动和人搭话，聊聊彼此的车和改装', value: 'E' },
      { text: '安静看车，很少主动开口', value: 'I' }
    ]
  },
  {
    dimension: 'EI', text: '你最喜欢的游戏时刻是？',
    options: [
      { text: '和朋友一起搞出离谱的操作，笑到肚子疼', value: 'E' },
      { text: '终于突破自己的最佳圈速，热血沸腾', value: 'I' }
    ]
  },
  {
    dimension: 'EI', text: '线上对局中，你更享受？',
    options: [
      { text: '和对手近身缠斗，感受竞争的刺激', value: 'E' },
      { text: '一个人默默跑节奏，专注超越自己', value: 'I' }
    ]
  },
  {
    dimension: 'EI', text: '你更喜欢在什么环境里开车？',
    options: [
      { text: '热闹的线上大厅，和陌生人同场竞技', value: 'E' },
      { text: '安静的私人赛道，独自刷圈', value: 'I' }
    ]
  },
  {
    dimension: 'EI', text: '车友群里聊起天来，你是？',
    options: [
      { text: '消息秒回，永远在群里冒泡的那个', value: 'E' },
      { text: '默默围观，看到感兴趣的才说两句', value: 'I' }
    ]
  },
  {
    dimension: 'EI', text: '你更享受独自开车还是结伴出行？',
    options: [
      { text: '一群人热热闹闹才有意思', value: 'E' },
      { text: '一个人开车是最放松的时刻', value: 'I' }
    ]
  },
  {
    dimension: 'EI', text: '跑完一把紧张的对战，你会？',
    options: [
      { text: '忍不住立刻开下一把，根本停不下来', value: 'E' },
      { text: '需要休息一下，让心跳平复下来', value: 'I' }
    ]
  },
  {
    dimension: 'EI', text: '你更愿意参与哪种活动？',
    options: [
      { text: '多人合作或对战模式，一起玩才爽', value: 'E' },
      { text: '个人计时赛或故事模式，沉浸在自己的世界', value: 'I' }
    ]
  },
  {
    dimension: 'EI', text: '线下车聚，对你来说吸引力在于？',
    options: [
      { text: '能和真人交流，分享驾驶体验和趣事', value: 'E' },
      { text: '看别人的车和收藏，默默欣赏就够了', value: 'I' }
    ]
  },
  // ─────────────── SN（感觉/直觉）────────────────────────
  {
    dimension: 'SN', text: '在游戏里，你通常扮演什么角色？',
    options: [
      { text: '技术型玩家，研究每一辆车的极限', value: 'S' },
      { text: '整活型玩家，搞事情比赢比赛更有意思', value: 'N' }
    ]
  },
  {
    dimension: 'SN', text: '你更愿意开什么样的车？',
    options: [
      { text: '难度高、有挑战性的车，征服它才是乐趣', value: 'N' },
      { text: '容易上手的车，效率为王', value: 'S' }
    ]
  },
  {
    dimension: 'SN', text: '你更喜欢什么路面？',
    options: [
      { text: '柏油赛道，干净利落，圈速说明一切', value: 'S' },
      { text: '拉力越野泥泞路，未知的路况才有意思', value: 'N' }
    ]
  },
  {
    dimension: 'SN', text: '你更喜欢哪种驱动方式？',
    options: [
      { text: '后驱，享受漂移和过度转向的乐趣', value: 'S' },
      { text: '四驱，稳定的抓地力和强大的牵引力', value: 'N' }
    ]
  },
  {
    dimension: 'SN', text: '你更喜欢手动挡还是自动挡？',
    options: [
      { text: '手动挡，掌控档位的感觉才是真正的驾驶', value: 'S' },
      { text: '自动挡，专注方向和刹车就够了', value: 'N' }
    ]
  },
  {
    dimension: 'SN', text: '你更喜欢哪种外观风格的车？',
    options: [
      { text: '战斗感满满，大尾翼大包围的那种', value: 'S' },
      { text: '低调有内涵，看着普通但越看越耐看', value: 'N' }
    ]
  },
  {
    dimension: 'SN', text: '当你选中一辆车后，你会？',
    options: [
      { text: '专注把它练到极致，不换车', value: 'S' },
      { text: '开一段时间就想换，体验不同的风格', value: 'N' }
    ]
  },
  {
    dimension: 'SN', text: '关于车辆改装，你更看重？',
    options: [
      { text: '实际的性能提升，马力、刹车、悬挂', value: 'S' },
      { text: '排气和声浪，那种让人肾上腺素飙升的感觉', value: 'N' }
    ]
  },
  {
    dimension: 'SN', text: '你更喜欢哪种比赛？',
    options: [
      { text: '有精确规则和计时标准的正式赛事', value: 'S' },
      { text: '创意满满的表演赛或整活赛', value: 'N' }
    ]
  },
  {
    dimension: 'SN', text: '对于车辆的历史和背景，你在意吗？',
    options: [
      { text: '不太关注，好开就行', value: 'S' },
      { text: '每辆车背后的故事让我更爱它', value: 'N' }
    ]
  },
  {
    dimension: 'SN', text: '你更喜欢哪种天气效果？',
    options: [
      { text: '晴天，稳定的抓地和清晰的视野', value: 'S' },
      { text: '雨雪天气，湿滑路面更有挑战性', value: 'N' }
    ]
  },
  // ─────────────── TF（思考/情感）────────────────────────
  {
    dimension: 'TF', text: '关于胜负，你的心态是？',
    options: [
      { text: '赢了开心，输了难受，必须复盘到满意为止', value: 'T' },
      { text: '赢不赢无所谓，开心就好，认真你就输了', value: 'F' }
    ]
  },
  {
    dimension: 'TF', text: '关于车速，你更认可？',
    options: [
      { text: '直道快才是真的快，大马力后驱才是信仰', value: 'T' },
      { text: '弯道技术才是真本事，刹车和走线才是艺术', value: 'F' }
    ]
  },
  {
    dimension: 'TF', text: '你选车的核心标准是？',
    options: [
      { text: '性能数据必须好看，0-100必须快', value: 'T' },
      { text: '看着顺眼就行，改装是一种态度表达', value: 'F' }
    ]
  },
  {
    dimension: 'TF', text: '你对痛车的态度是？',
    options: [
      { text: '太酷了！个性化表达是灵魂', value: 'F' },
      { text: '华而不实，性能才是正义', value: 'T' }
    ]
  },
  {
    dimension: 'TF', text: '你更在意车给你的感受，还是它的实际表现？',
    options: [
      { text: '数据不会骗人，圈速才是硬道理', value: 'T' },
      { text: '感觉对了一切都对，开心最重要', value: 'F' }
    ]
  },
  {
    dimension: 'TF', text: '关于大排量自吸 vs 小排量涡轮，你站哪边？',
    options: [
      { text: '大排量自吸，线性的动力输出无可替代', value: 'F' },
      { text: '小排量涡轮，涡轮迟滞的爆发感才刺激', value: 'T' }
    ]
  },
  {
    dimension: 'TF', text: '你更愿意为哪种车花钱？',
    options: [
      { text: '外观改色、轮毂、贴纸——帅就够了', value: 'F' },
      { text: '动力升级、刹车、避震——快才是真的帅', value: 'T' }
    ]
  },
  {
    dimension: 'TF', text: '关于改装，你的态度是？',
    options: [
      { text: '改装是为了性能提升，越快越好', value: 'T' },
      { text: '改装是表达个性，帅比快更重要', value: 'F' }
    ]
  },
  {
    dimension: 'TF', text: '你喜欢在游戏里拍照吗？',
    options: [
      { text: '喜欢，遇到好看的风景或车一定会停下来拍', value: 'F' },
      { text: '不怎么拍，赛车游戏专心跑就对了', value: 'T' }
    ]
  },
  {
    dimension: 'TF', text: '你对车辆舒适性的态度是？',
    options: [
      { text: '赛车座椅和防滚架才是标配', value: 'T' },
      { text: '内饰豪华坐着舒服才是享受', value: 'F' }
    ]
  },
  {
    dimension: 'TF', text: '你如何看待车辆的"颜值"？',
    options: [
      { text: '颜值即正义，好看比强更重要', value: 'F' },
      { text: '再帅的车，实力不行我也不会选', value: 'T' }
    ]
  },
  // ─────────────── JP（判断/知觉）────────────────────────
  {
    dimension: 'JP', text: '买车之前，你会？',
    options: [
      { text: '查评测、跑数据、把每一项参数都研究透', value: 'J' },
      { text: '凭感觉选，帅就完事了', value: 'P' }
    ]
  },
  {
    dimension: 'JP', text: '出发去跑赛道前你会？',
    options: [
      { text: '提前检查所有车辆状态，准备好备用零件', value: 'J' },
      { text: '差不多得了，出问题再说', value: 'P' }
    ]
  },
  {
    dimension: 'JP', text: '关于调校，你的态度是？',
    options: [
      { text: '反复微调参数，追求每一个细节的完美', value: 'J' },
      { text: '差不多就行，车本来就是用来开的', value: 'P' }
    ]
  },
  {
    dimension: 'JP', text: '遇到一辆完全不会开的车，你会？',
    options: [
      { text: '先查攻略和调校方案，把车子研究透再下场', value: 'J' },
      { text: '直接上场摸索，靠实战找感觉', value: 'P' }
    ]
  },
  {
    dimension: 'JP', text: '你更享受哪种游戏时光？',
    options: [
      { text: '跑排名、刷纪录，把分数和段位打上去', value: 'J' },
      { text: '逛地图、拍照、找彩蛋，无拘无束地探索', value: 'P' }
    ]
  },
  {
    dimension: 'JP', text: '比赛前你会制定策略吗？',
    options: [
      { text: '提前规划走线和节奏，按计划执行', value: 'J' },
      { text: '现场随机应变，状态来了自然就快', value: 'P' }
    ]
  },
  {
    dimension: 'JP', text: '关于收藏车辆，你的做法是？',
    options: [
      { text: '列好清单，有计划地一辆一辆收集', value: 'J' },
      { text: '遇到喜欢的就买，不强求', value: 'P' }
    ]
  },
  {
    dimension: 'JP', text: '关于线上竞技，你的态度是？',
    options: [
      { text: '认真对待每一场排名，输了会复盘找原因', value: 'J' },
      { text: '排名不重要，开心就好', value: 'P' }
    ]
  },
  {
    dimension: 'JP', text: '对于游戏内的季节和活动，你？',
    options: [
      { text: '提前规划好要做哪些任务和奖励', value: 'J' },
      { text: '随便玩，想到什么玩什么', value: 'P' }
    ]
  },
  {
    dimension: 'JP', text: '你的车库通常是怎么整理的？',
    options: [
      { text: '按品牌或类型分类，井井有条', value: 'J' },
      { text: '随便摆，反正记得停在哪就行', value: 'P' }
    ]
  },
  {
    dimension: 'JP', text: '比赛结束后，你通常会？',
    options: [
      { text: '看排名、查分段、研究哪里还能快', value: 'J' },
      { text: '直接开下一把，或者换辆车玩', value: 'P' }
    ]
  },

  // ─────────────── 追加题 · EI（内向/外向）────────────────────
  {
    dimension: 'EI', text: '你更倾向于哪种驾驶陪伴？',
    options: [
      { text: '开黑语音，和队友全程连麦', value: 'E' },
      { text: '安静开车，享受自己的思考时间', value: 'I' }
    ]
  },

  // ─────────────── 追加题 · SN（感觉/直觉）────────────────────
  {
    dimension: 'SN', text: '你更喜欢哪种汽车文化？',
    options: [
      { text: '方程式赛车，追求极致的空气动力学', value: 'S' },
      { text: '经典老爷车，每一台都有故事', value: 'N' }
    ]
  },
  {
    dimension: 'SN', text: '选赛道时，你更在意？',
    options: [
      { text: '高难度的技术挑战，征服每一个弯角', value: 'S' },
      { text: '沿途的风景和整体氛围感', value: 'N' }
    ]
  },

  // ─────────────── 追加题 · TF（思考/情感）────────────────────
  {
    dimension: 'TF', text: '你更容易被什么打动？',
    options: [
      { text: '一个难以置信的零百加速成绩', value: 'T' },
      { text: '一张让人过目不忘的老车照片', value: 'F' }
    ]
  },
  {
    dimension: 'TF', text: '你对"车如其人"这句话的看法是？',
    options: [
      { text: '车是工具，性能代表一切', value: 'T' },
      { text: '车是有灵魂的，它代表你的态度', value: 'F' }
    ]
  }
];

/* ================================================================
 * 4. 测试状态
 * ================================================================ */
let currentQuestion = 0;
let answers = { EI: 0, SN: 0, TF: 0, JP: 0 };
let answerLog = []; // 记录每题选的 value，如 ['E','N','T','J',...]

/* ================================================================
 * 5. 核心函数
 * ================================================================ */

/**
 * 切换页面显示
 * @param {string} pageId - 页面元素ID（landing / quiz / result）
 */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

/**
 * 开始测试
 * 重置所有状态，切换到答题页
 */
function startQuiz() {
  currentQuestion = 0;
  answers = { EI: 0, SN: 0, TF: 0, JP: 0 };
  answerLog = [];
  // 先去掉过渡立刻清零，再切页（避免旧进度条动画残留）
  const fill = document.getElementById('progressFill');
  fill.style.transition = 'none';
  fill.style.width = '0%';
  showPage('quiz');
  renderQuestion();
}

/**
 * 渲染当前题目
 * 更新进度条、题目文本、选项列表
 */
function renderQuestion() {
  const q = questions[currentQuestion];
  document.getElementById('currentQ').textContent = currentQuestion + 1;
  document.getElementById('totalQ').textContent = questions.length;
  document.getElementById('questionNumber').textContent = 'Q ' + (currentQuestion + 1);
  document.getElementById('questionText').textContent = q.text;

  // 显示当前维度标签
  const dimMap = { 'EI': '外向/内向', 'SN': '感觉/直觉', 'TF': '思考/情感', 'JP': '判断/知觉' };
  document.getElementById('dimensionTag').textContent = dimMap[q.dimension] || '';

  // 返回按钮：除了第1题都显示
  document.getElementById('backBtn').style.display = currentQuestion === 0 ? 'none' : '';

  // 动态更新进度条（答完当前题后，下一题的进度）
  const pct = ((currentQuestion) / questions.length) * 100;
  document.getElementById('progressFill').style.width = pct + '%';

  // 渲染选项，带滑入动画
  const opts = document.getElementById('options');
  opts.innerHTML = q.options.map((opt, i) =>
    `<div class="option" onclick="selectOption('${q.dimension}', '${opt.value}')"
          style="animation: slideUp 0.3s ${i * 0.07}s both var(--ease-out)">
      ${opt.text}
    </div>`
  ).join('');
}

/* 计分辅助：第一个字母（E/S/T/J）计+1，其余不计 */
const FIRST = new Set(['E', 'S', 'T', 'J']);

/**
 * 选择选项
 * @param {string} dimension - MBTI维度（EI / SN / TF / JP）
 * @param {string} value     - 选择的值（第一个字母 E/S/T/J 计+1）
 *
 * 计分逻辑：
 *   value 为第一个字母（E/S/T/J）→ 该维度 +1
 *   value 为第二个字母（I/N/F/P）→ 不加分
 *
 * 流程：
 *   1. 更新答案计数
 *   2. 有下一题 → 渲染下一题
 *   3. 最后一题 → 展示结果
 */
function selectOption(dimension, value) {
  // 重答同一题时，先扣掉旧答案的分数
  const prev = answerLog[currentQuestion];
  if (prev !== undefined && FIRST.has(prev)) answers[dimension]--;
  // 记录并累加新答案
  answerLog[currentQuestion] = value;
  if (FIRST.has(value)) answers[dimension]++;

  currentQuestion < questions.length - 1 ? (currentQuestion++, renderQuestion()) : showResult();
}

/**
 * 返回上一题
 */
function prevQuestion() {
  if (currentQuestion === 0) return;
  const prev = answerLog[currentQuestion];
  if (prev !== undefined && FIRST.has(prev)) answers[questions[currentQuestion].dimension]--;
  answerLog[currentQuestion] = undefined;
  currentQuestion--;
  renderQuestion();
}

/**
 * 计算 MBTI 类型
 * @returns {string} 4位MBTI人格代码，如 'INTJ'
 *
 * 48题分布：EI=11题 | SN=13题 | TF=13题 | JP=11题
 * 逻辑：哪个字母方向的百分比 > 50% 就选哪个
 */
function calculateMBTI() {
  const eiPct = answers.EI / 11 * 100;
  const snPct = answers.SN / 13 * 100;
  const tfPct = answers.TF / 13 * 100;
  const jpPct = answers.JP / 11 * 100;
  const e = eiPct > 50 ? 'E' : 'I';
  const s = snPct > 50 ? 'S' : 'N';
  const t = tfPct > 50 ? 'T' : 'F';
  const j = jpPct > 50 ? 'J' : 'P';
  return e + s + t + j;
}

/**
 * 展示测试结果
 *
 * 流程：
 *   1. 计算用户MBTI类型 + 四维百分比
 *   2. 在 cars 数组中查找对应车辆
 *   3. 填充结果页（MBTI、类型分组、车型名、分类、图片、标签、描述）
 *   4. 渲染人格解读（\n\n 分段）
 *   5. 渲染四维百分比条
 *   6. 渲染底部16车画廊（懒加载）
 *   7. 切换到结果页视图
 */

/* MBTI 类型 → 人格类型分组 */
const TYPE_GROUP = {
  INTJ: { name: 'Analysts · 分析师', en: 'Analysts' },
  INTP: { name: 'Analysts · 分析师', en: 'Analysts' },
  ENTJ: { name: 'Analysts · 分析师', en: 'Analysts' },
  ENTP: { name: 'Analysts · 分析师', en: 'Analysts' },
  INFJ: { name: 'Diplomats · 外交家', en: 'Diplomats' },
  INFP: { name: 'Diplomats · 外交家', en: 'Diplomats' },
  ENFJ: { name: 'Diplomats · 外交家', en: 'Diplomats' },
  ENFP: { name: 'Diplomats · 外交家', en: 'Diplomats' },
  ISTJ: { name: 'Sentinels · 守护者', en: 'Sentinels' },
  ISFJ: { name: 'Sentinels · 守护者', en: 'Sentinels' },
  ESTJ: { name: 'Sentinels · 守护者', en: 'Sentinels' },
  ESFJ: { name: 'Sentinels · 守护者', en: 'Sentinels' },
  ISTP: { name: 'Explorers · 探险家', en: 'Explorers' },
  ISFP: { name: 'Explorers · 探险家', en: 'Explorers' },
  ESTP: { name: 'Explorers · 探险家', en: 'Explorers' },
  ESFP: { name: 'Explorers · 探险家', en: 'Explorers' },
};

function showResult() {
  const mbti = calculateMBTI();
  const car = cars.find(c => c.mbti === mbti) || cars[0];

  // ── 四维百分比 (ARKTI风格渲染) ───────────────────────────
  const ei = answers.EI;
  const sn = answers.SN;
  const tf = answers.TF;
  const jp = answers.JP;

  // 每个维度的 left 方向百分比（0-100）
  const eiPct = Math.round(50 + (ei - (11 - ei)) / 11 * 50);
  const snPct = Math.round(50 + (sn - (13 - sn)) / 13 * 50);
  const tfPct = Math.round(50 + (tf - (13 - tf)) / 13 * 50);
  const jpPct = Math.round(50 + (jp - (11 - jp)) / 11 * 50);

  // dominantPct = dominant 方向的百分比（ARKTI 逻辑）
  const dimConfig = [
    { dim: 'EI', left: 'E', right: 'I', color: '#9b59b6', labelLeft: '外向', labelRight: '内向' },
    { dim: 'SN', left: 'S', right: 'N', color: '#3498db', labelLeft: '实感', labelRight: '直觉' },
    { dim: 'TF', left: 'T', right: 'F', color: '#e74c3c', labelLeft: '思考', labelRight: '情感' },
    { dim: 'JP', left: 'J', right: 'P', color: '#f39c12', labelLeft: '判断', labelRight: '知觉' },
  ];

  const pcts = { EI: eiPct, SN: snPct, TF: tfPct, JP: jpPct };
  // dominant 方向的百分比（与 ARKTI 匹配算法一致）
  const userDomPcts = {
    EI: mbti[0] === 'E' ? eiPct : 100 - eiPct,
    SN: mbti[1] === 'S' ? snPct : 100 - snPct,
    TF: mbti[2] === 'T' ? tfPct : 100 - tfPct,
    JP: mbti[3] === 'J' ? jpPct : 100 - jpPct,
  };

  dimConfig.forEach(({ dim, left, right, color, labelLeft, labelRight }) => {
    const pct = pcts[dim];
    const mbtiIdx = { EI: 0, SN: 1, TF: 2, JP: 3 };
    const dominant = mbti[mbtiIdx[dim]];
    const dominantIsLeft = dominant === left;
    // dominant 方向的百分比
    const dominantPct = dominantIsLeft ? pct : 100 - pct;
    // 手柄位置：dominant 偏左则手柄偏左，dominant 偏右则手柄偏右
    const handlePos = dominantIsLeft
      ? 50 - (dominantPct - 50)   // dominant 左 → 手柄往左移
      : 50 + (dominantPct - 50);  // dominant 右 → 手柄往右移
    const dominantLabel = dominantIsLeft ? labelLeft : labelRight;

    const row = document.querySelector(`[data-dim="${dim}"]`);
    if (!row) return;
    row.querySelector('.trait-track').style.backgroundColor = color;
    row.querySelector('.trait-handle').style.left = `calc(${handlePos}% - 7px)`;
    row.querySelector('.trait-handle').style.borderColor = color;
    const pctEl = row.querySelector('.trait-percent');
    pctEl.style.left = `${handlePos}%`;
    pctEl.style.color = color;
    pctEl.textContent = `${dominantPct}% ${dominantLabel}`;
  });

  // ── 填充结果页基本信息 ─────────────────────────────────────
  document.getElementById('resultMbti').textContent = mbti;
  document.getElementById('resultTypeGroup').textContent = TYPE_GROUP[mbti]?.name || '';
  document.getElementById('resultCarName').textContent = car.name;
  document.getElementById('resultCarType').textContent = car.category;
  document.getElementById('resultImage').src = car.image;

  // ── 车辆标签 ────────────────────────────────────────────────
  const tagsEl = document.getElementById('resultTags');
  tagsEl.innerHTML = (car.tags || []).map(t => `<span class="result-tag">${t}</span>`).join('');

  // 车辆描述支持 \n\n 分段（第一段=概述，第二段=FH5驾驶体验）
  const descParts = car.description.split('\n\n');
  const descHtml = descParts.map(p => `<p>${p}</p>`).join('');
  document.getElementById('resultDescription').innerHTML = descHtml;

  // 主图加载完成后移除骨架屏动画
  document.getElementById('resultImage').onload = function() { this.classList.add('loaded'); };
  document.getElementById('resultImage').onerror = function() { this.classList.add('loaded'); };

  // 渲染人格解读（\n\n 分段，拆成多个 <span>）
  const mbtiText = mbtiExplanations[mbti] || '这是一辆与你灵魂契合的座驾。';
  const mbtiParts = mbtiText.split('\n\n');
  const mbtiHtml = mbtiParts.map(p => `<span>${p}</span>`).join('');
  document.getElementById('mbtiExplanation').innerHTML = mbtiHtml;

  // 渲染底部 16 车画廊（懒加载）
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = cars.map(c =>
    `<div class="gallery-item">
      <img
        src="${c.image}"
        alt="${c.name}"
        loading="lazy"
        onload="this.classList.add('loaded')"
        onerror="this.classList.add('loaded')"
      >
      <div class="car-name">${c.name}</div>
      <div class="car-mbti">${c.mbti}</div>
    </div>`
  ).join('');

  // ── 四维百分比（用于精细匹配）───────────────────────────────
  const dimPairs = [
    { key: 'EI', userLetter: mbti[0], idx: 0 },
    { key: 'SN', userLetter: mbti[1], idx: 1 },
    { key: 'TF', userLetter: mbti[2], idx: 2 },
    { key: 'JP', userLetter: mbti[3], idx: 3 },
  ];

  // ── 计算并渲染 16 车契合度排名 ─────────────────────────────
  const userMBTI = mbti;
  const userCat = car.category;
  const ranked = cars.map(c => {
    const isExact = c.mbti === userMBTI;
    const sameCat = c.category === userCat;

    // 基础分：字母匹配数 × 25
    const matchCount = c.mbti.split('').filter((ch, i) => ch === userMBTI[i]).length;
    let score = matchCount * 25;

    // 精细维度分：相同字母的维度，dominant 方向百分比越高 → 加成分越高（至多 5%）
    dimPairs.forEach(({ key, idx }) => {
      if (c.mbti[idx] === userMBTI[idx]) {
        score += userDomPcts[key] * 0.05;
      }
    });

    // 同分类 +5%，精确匹配 +5%（含分类加成）
    if (sameCat) score += 5;
    if (isExact) score += 5;

    score = Math.round(Math.min(score, 100));
    const letterDiff = c.mbti.split('').filter((ch, i) => ch !== userMBTI[i]).length;
    const sortKey = score * 1000 - letterDiff * 10 - (sameCat ? 0 : 1);
    return { name: c.name, mbti: c.mbti, image: c.image, category: c.category, score, letterDiff, isExact, sortKey };
  }).sort((a, b) => b.sortKey - a.sortKey);

  const rankingList = document.getElementById('rankingList');
  rankingList.innerHTML = ranked.map((c, i) => {
    const rankClass = i === 0 ? 'top-1' : i === 1 ? 'top-2' : i === 2 ? 'top-3' : '';
    const displayPct = c.isExact ? '100%+' : c.score + '%';
    return `<div class="ranking-item ${rankClass}">
      <div class="ranking-rank">#${i + 1}</div>
      <img class="ranking-thumb" src="${c.image}" alt="${c.name}" loading="lazy">
      <div class="ranking-info">
        <div class="ranking-name">${c.name}</div>
        <div class="ranking-mbti">${c.mbti}</div>
      </div>
      <div class="ranking-bar-wrap">
        <div class="ranking-bar">
          <div class="ranking-bar-fill" style="width:${c.isExact ? 100 : c.score}%"></div>
        </div>
        <div class="ranking-pct">${displayPct}</div>
      </div>
    </div>`;
  }).join('');

  // 排名说明
  const note = document.getElementById('rankingNote');
  note.innerHTML = `契合度 = MBTI字母匹配（每字母 25%）+ 四维百分比对齐分（每维度至多 5%）+ 同分类 +5% + 精确匹配 +5%<br>
  <span>100%+</span> = 与你MBTI完全一致的精确匹配`;
  note.style.display = 'block';

  showPage('result');
}

/**
 * 重新开始测试
 */
function retry() {
  currentQuestion = 0;
  answers = { EI: 0, SN: 0, TF: 0, JP: 0 };
  answerLog = [];
  showPage('landing');
}

/**
 * 分享测试结果
 * 支持：Web Share API（移动端）/ 复制到剪贴板（桌面端）
 */
function shareResult() {
  const mbti = document.getElementById('resultMbti').textContent;
  const typeGroup = TYPE_GROUP[mbti]?.name || '';
  const carName = document.getElementById('resultCarName').textContent;
  const carDesc = document.getElementById('resultDescription').textContent.replace(/\n\n/g, '。').replace(/\n/g, '');
  const text = `我是 ${mbti}（${typeGroup}）× ${carName}\n\n${carDesc}\n\n👉 FORZA HORIZON × MBTI 座驾人格测试`;

  if (navigator.share) {
    navigator.share({ text });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.querySelector('.share-btn');
      const orig = btn.textContent;
      btn.textContent = '已复制 ✓';
      btn.style.borderColor = '#4ade80';
      btn.style.color = '#4ade80';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 2000);
    });
  }
}
