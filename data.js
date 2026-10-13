// 楊梅高中分機一覽表 資料庫
// 依據「桃園市立楊梅高級中學語音電話分機一覽表」版本 115/09/07 總務處編製

const DIRECTORY_META = {
  schoolName: "桃園市立楊梅高級中等學校",
  title: "楊梅高中分機一覽表",
  subTitle: "桃園市立楊梅高級中學語音電話分機一覽表",
  editor: "總務處",
  version: "115/09/07",
  switchboards: [
    { label: "代表號 (總機)", number: "03-4789618", full: "03-4789618" },
    { label: "二線", number: "4780449", full: "03-4780449" },
    { label: "三線", number: "4780740", full: "03-4780740" }
  ],
  hotlines: [
    { dept: "教務處", phone: "4783574", fax: "4882675" },
    { dept: "學務處", phone: "4758950", fax: "4757034" },
    { dept: "總務處", phone: "4783349", fax: "4780164" },
    { dept: "輔導室", phone: "4758437", fax: "" },
    { dept: "圖書館", phone: "4780586", fax: "" },
    { dept: "校安中心", phone: "4854998", fax: "4780428" },
    { dept: "人事室", phone: "4784103", fax: "4755774" },
    { dept: "會計室", phone: "4789683", fax: "4782322" },
    { dept: "員生社", phone: "4750453", fax: "" },
    { dept: "校長室傳真", phone: "", fax: "4856117" }
  ]
};

const DIRECTORY_SECTIONS = [
  {
    id: "principal",
    category: "admin",
    categoryName: "行政處室",
    title: "校長室",
    color: "#2563EB", // 皇家藍
    lightColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    icon: "award",
    directPhone: "",
    fax: "4856117",
    items: [
      { title: "校長", name: "鍾校長", ext: ["1101"] },
      { title: "秘書", name: "黃秘書", ext: ["1102"] },
      { title: "技工", name: "劉小姐", ext: ["1103"] },
      { title: "校長宿舍", name: "", ext: ["1104"] }
    ]
  },
  {
    id: "cooperation",
    category: "service",
    categoryName: "協力與會議",
    title: "協力組織 / 會議室",
    color: "#0284C7", // 天空藍
    lightColor: "#F0F9FF",
    borderColor: "#BAE6FD",
    icon: "users",
    directPhone: "",
    fax: "",
    items: [
      { title: "警衛室", name: "", ext: ["1110"] },
      { title: "聯合辦公室", name: "", ext: ["1112"] },
      { title: "第一會議室", name: "", ext: ["1113"] },
      { title: "交通安全教室", name: "", ext: ["1114"] },
      { title: "第二會議室", name: "", ext: ["1115"] }
    ]
  },
  {
    id: "personnel",
    category: "admin",
    categoryName: "行政處室",
    title: "人事室",
    color: "#7C3AED", // 羅蘭紫
    lightColor: "#F5F3FF",
    borderColor: "#DDD6FE",
    icon: "badge-check",
    directPhone: "4784103",
    fax: "4755774",
    items: [
      { title: "主任", name: "邱主任", ext: ["1121"] },
      { title: "組員", name: "陳先生", ext: ["1122"] }
    ]
  },
  {
    id: "accounting",
    category: "admin",
    categoryName: "行政處室",
    title: "會計室",
    color: "#9333EA", // 亮紫色
    lightColor: "#FAF5FF",
    borderColor: "#E9D5FF",
    icon: "calculator",
    directPhone: "4789683",
    fax: "4782322",
    items: [
      { title: "主任", name: "林主任", ext: ["1131"] },
      { title: "組員", name: "張小姐", ext: ["1132"] },
      { title: "佐理員", name: "陳小姐", ext: ["1133"] }
    ]
  },
  {
    id: "academic",
    category: "admin",
    categoryName: "行政處室",
    title: "教務處",
    color: "#1D4ED8", // 湛藍
    lightColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    icon: "book-open",
    directPhone: "4783574",
    fax: "4882675",
    items: [
      { title: "主任", name: "李主任", ext: ["1201"] },
      { title: "教學組長", name: "邱組長", ext: ["1211"] },
      { title: "幹事", name: "張小姐", ext: ["1212"] },
      { title: "印刷室", name: "陳先生", ext: ["1213"] },
      { title: "註冊組長", name: "賴組長", ext: ["1221"] },
      { title: "幹事", name: "曾小姐", ext: ["1222"] },
      { title: "設備組長", name: "鄭組長", ext: ["1231"] },
      { title: "助理員", name: "謝小姐", ext: ["1232"] },
      { title: "書記", name: "吳先生", ext: ["1233"] },
      { title: "數位前導助理", name: "王小姐", ext: ["1234"] },
      { title: "實驗研究組長", name: "邱組長", ext: ["1241"] },
      { title: "幹事", name: "宋先生", ext: ["1242"] },
      { title: "均質化專案助理", name: "", ext: ["1243"] },
      { title: "學期歷程檔案助理", name: "楊小姐", ext: ["1244"] },
      { title: "試務組組長", name: "蘇組長", ext: ["1251"] },
      { title: "幹事", name: "蔡小姐", ext: ["1252"] },
      { title: "教務處專用分機", name: "", ext: ["1261"] },
      { title: "英語教師", name: "", ext: ["1262"] },
      { title: "雙語助理", name: "葉先生", ext: ["1263"] },
      { title: "雙語教師", name: "高老師", ext: ["1264"] }
    ]
  },
  {
    id: "general_affairs",
    category: "admin",
    categoryName: "行政處室",
    title: "總務處",
    color: "#D97706", // 溫潤琥珀橘
    lightColor: "#FFFBEB",
    borderColor: "#FDE68A",
    icon: "wrench",
    directPhone: "4783349",
    fax: "4780164",
    items: [
      { title: "主任", name: "劉主任", ext: ["1401"] },
      { title: "文書組長", name: "黃組長", ext: ["1411"] },
      { title: "臨時人員", name: "鍾小姐", ext: ["1412"] },
      { title: "出納組長", name: "黃組長", ext: ["1421"] },
      { title: "庶務組長", name: "劉組長", ext: ["1431"] },
      { title: "財管管理員", name: "謝先生", ext: ["1432"] },
      { title: "採購幹事", name: "張先生", ext: ["1433"] },
      { title: "學務創新人力", name: "彭先生", ext: ["1434"] },
      { title: "臨時人員", name: "宋先生", ext: ["1435"] }
    ]
  },
  {
    id: "coop_store",
    category: "service",
    categoryName: "協力與會議",
    title: "員生社",
    color: "#059669", // 祖母綠
    lightColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    icon: "shopping-bag",
    directPhone: "4750453",
    fax: "",
    items: [
      { title: "員生社", name: "林小姐", ext: ["1491"] }
    ]
  },
  {
    id: "internship",
    category: "admin",
    categoryName: "行政處室",
    title: "實習處",
    color: "#0D9488", // 湖水青
    lightColor: "#F0FDFA",
    borderColor: "#99F6E4",
    icon: "cpu",
    directPhone: "",
    fax: "",
    items: [
      { title: "實習處主任", name: "簡主任", ext: ["1701"] },
      { title: "實習就業組長", name: "蔡組長", ext: ["1702"] },
      { title: "資訊科主任", name: "廖主任", ext: ["1703"] },
      { title: "技佐", name: "林先生", ext: ["1704"] },
      { title: "電子科主任", name: "余主任", ext: ["1705"] },
      { title: "技士", name: "卓小姐", ext: ["1706"] }
    ]
  },
  {
    id: "student_affairs",
    category: "admin",
    categoryName: "行政處室",
    title: "學務處",
    color: "#DB2777", // 玫瑰洋紅
    lightColor: "#FDF2F8",
    borderColor: "#FBCFE8",
    icon: "activity",
    directPhone: "4758950",
    fax: "4757034",
    items: [
      { title: "主任", name: "呂主任", ext: ["1301"] },
      { title: "午餐秘書", name: "李老師", ext: ["1302"] },
      { title: "學務創新人力", name: "呂先生", ext: ["1303"] },
      { title: "訓育組長", name: "簡組長", ext: ["1311"] },
      { title: "幹事", name: "傅小姐", ext: ["1312"] },
      { title: "活動組長", name: "魏組長", ext: ["1321"] },
      { title: "學務創新人力", name: "林先生", ext: ["1322"] },
      { title: "體育組長", name: "廖組長", ext: ["1331"] },
      { title: "游泳池", name: "陳先生", ext: ["1333"] },
      { title: "管理員", name: "鍾小姐", ext: ["1334"] },
      { title: "跆拳道館", name: "", ext: ["1335"] },
      { title: "衛生組長", name: "詹組長", ext: ["1341"] },
      { title: "護理師(健康中心)", name: "陳小姐", ext: ["1342"] },
      { title: "學務創新人力", name: "張先生", ext: ["1343"] },
      { title: "健康中心", name: "陳小姐", ext: ["1119"] },
      { title: "禮堂準備室", name: "", ext: ["1324"] }
    ]
  },
  {
    id: "campus_security",
    category: "admin",
    categoryName: "行政處室",
    title: "校安中心",
    color: "#DC2626", // 鮮紅
    lightColor: "#FEF2F2",
    borderColor: "#FECACA",
    icon: "shield-alert",
    directPhone: "4854998",
    fax: "4780428",
    items: [
      { title: "學務創新人力", name: "廖先生", ext: ["1351"] },
      { title: "生輔組長", name: "張組長", ext: ["1352"] },
      { title: "學務創新人力", name: "李先生", ext: ["1353"] },
      { title: "學務創新人力", name: "陳先生", ext: ["1354"] },
      { title: "幹事", name: "范小姐", ext: ["1355"] },
      { title: "學務創新人力", name: "郭先生", ext: ["1356"] },
      { title: "學務創新人力", name: "彭先生", ext: ["1357"] }
    ]
  },
  {
    id: "counseling",
    category: "admin",
    categoryName: "行政處室",
    title: "輔導室",
    color: "#6D28D9", // 深紫羅蘭
    lightColor: "#F5F3FF",
    borderColor: "#DDD6FE",
    icon: "heart-handshake",
    directPhone: "4758437",
    fax: "",
    items: [
      { title: "輔導主任", name: "林主任", ext: ["1503"] },
      { title: "專任輔導教師", name: "陳老師", ext: ["1504"] },
      { title: "專任輔導教師", name: "吳老師", ext: ["1507"] },
      { title: "專任輔導教師", name: "金老師", ext: ["1501"] },
      { title: "專任輔導教師", name: "陳老師", ext: ["1502"] },
      { title: "特教教師1", name: "何老師", ext: ["1505"] },
      { title: "特教教師2", name: "林老師", ext: ["1506"] },
      { title: "特教教師3", name: "曾老師", ext: ["1511"] },
      { title: "生涯資訊室", name: "", ext: ["1508"] },
      { title: "團體諮商室", name: "", ext: ["1509"] },
      { title: "學習中心", name: "", ext: ["1510"] }
    ]
  },
  {
    id: "library",
    category: "admin",
    categoryName: "行政處室",
    title: "圖書館",
    color: "#0891B2", // 藍綠青
    lightColor: "#ECFEFF",
    borderColor: "#A5F3FC",
    icon: "library",
    directPhone: "4780586",
    fax: "",
    items: [
      { title: "主任", name: "施主任", ext: ["1601"] },
      { title: "讀者服務組長", name: "何組長", ext: ["1602"] },
      { title: "資訊媒體組長", name: "賴組長", ext: ["1603"] },
      { title: "幹事/讀者服務櫃台", name: "呂小姐", ext: ["1605"] },
      { title: "喜閱學堂", name: "", ext: ["1606"] },
      { title: "演藝廳", name: "", ext: ["1607"] }
    ]
  },
  {
    id: "homeroom_teachers",
    category: "teachers",
    categoryName: "教師辦公室",
    title: "導師辦公室",
    color: "#EA580C", // 鮮橙橘
    lightColor: "#FFF7ED",
    borderColor: "#FED7AA",
    icon: "graduation-cap",
    directPhone: "",
    fax: "",
    items: [
      { title: "悅知樓1樓導師室 (高一)", name: "", ext: ["1361", "1365"] },
      { title: "悅知樓2樓導師室 (高一)", name: "", ext: ["1366"] },
      { title: "悅知樓3樓導師室 (高二)", name: "", ext: ["1362", "1364"] },
      { title: "日新樓1樓導師室 (高三)", name: "", ext: ["1363", "1367"] }
    ]
  },
  {
    id: "subject_teachers",
    category: "teachers",
    categoryName: "教師辦公室",
    title: "專任教師辦公室",
    color: "#BE123C", // 緋紅玫瑰
    lightColor: "#FFF1F2",
    borderColor: "#FECDD3",
    icon: "briefcase",
    directPhone: "",
    fax: "",
    items: [
      { title: "蘊慧樓1樓專一辦公室", name: "", ext: ["1271", "1275"] },
      { title: "蘊慧樓2樓專二辦公室", name: "", ext: ["1272"] },
      { title: "日新樓2樓專三辦公室", name: "", ext: ["1273"] },
      { title: "日新樓3樓專四辦公室", name: "", ext: ["1274"] }
    ]
  },
  {
    id: "laboratories",
    category: "labs",
    categoryName: "實驗與專科教室",
    title: "實驗室",
    color: "#0F766E", // 藍綠色
    lightColor: "#F0FDFA",
    borderColor: "#99F6E4",
    icon: "flask-conical",
    directPhone: "",
    fax: "",
    items: [
      { title: "化學實驗室", name: "", ext: ["1373"] },
      { title: "基礎理化實驗室", name: "", ext: ["1374"] },
      { title: "物理實驗室", name: "", ext: ["1375"] },
      { title: "生物實驗室", name: "", ext: ["1376"] },
      { title: "基礎生物實驗室", name: "", ext: ["1378"] },
      { title: "地科實驗室", name: "", ext: ["1379"] }
    ]
  },
  {
    id: "special_classrooms",
    category: "labs",
    categoryName: "實驗與專科教室",
    title: "專科教室",
    color: "#65A30D", // 亮草綠
    lightColor: "#F7FEE7",
    borderColor: "#D9F99D",
    icon: "monitor",
    directPhone: "",
    fax: "",
    items: [
      { title: "啟明樓校史室", name: "", ext: ["1284"] },
      { title: "語言教室", name: "", ext: ["1285"] },
      { title: "蘊慧樓電腦機房", name: "", ext: ["1286"] },
      { title: "電腦教室一", name: "", ext: ["1287"] },
      { title: "視聽一教室", name: "", ext: ["1288"] },
      { title: "電腦教室二", name: "", ext: ["1289"] },
      { title: "美術教室", name: "", ext: ["1291"] },
      { title: "科技應用教室", name: "", ext: ["1292"] },
      { title: "新興科技推廣教室", name: "", ext: ["1293"] },
      { title: "雙語教室", name: "", ext: ["1294"] },
      { title: "電腦教室三", name: "", ext: ["1295"] },
      { title: "探究與實作教室", name: "", ext: ["1296"] },
      { title: "環境教育中心", name: "", ext: ["1297"] }
    ]
  },
  {
    id: "rixin_building",
    category: "labs",
    categoryName: "實驗與專科教室",
    title: "日新樓專科教室",
    color: "#4F46E5", // 靛藍
    lightColor: "#EEF2FF",
    borderColor: "#C7D2FE",
    icon: "layers",
    directPhone: "",
    fax: "",
    items: [
      { title: "英語情境教室", name: "", ext: ["1711"] },
      { title: "日新樓展演中心", name: "", ext: ["1712"] },
      { title: "護理教室", name: "", ext: ["1751"] },
      { title: "計概教室", name: "", ext: ["1752"] },
      { title: "音樂教室", name: "", ext: ["1761"] },
      { title: "藝術生活教室", name: "", ext: ["1764"] },
      { title: "視覺藝術教室", name: "", ext: ["1765"] }
    ]
  },
  {
    id: "yufeng_building",
    category: "buildings",
    categoryName: "特色大樓與場館",
    title: "御風樓",
    color: "#0369A1", // 深海藍
    lightColor: "#F0F9FF",
    borderColor: "#BAE6FD",
    icon: "building",
    directPhone: "",
    fax: "",
    items: [
      { title: "御風2-1", name: "", ext: ["2421"] },
      { title: "御風2-2", name: "", ext: ["2422"] },
      { title: "御風2-3", name: "", ext: ["2423"] },
      { title: "御風3-1", name: "", ext: ["2431"] },
      { title: "御風3-2", name: "", ext: ["2432"] },
      { title: "御風3-3", name: "", ext: ["2433"] },
      { title: "御風3-4", name: "", ext: ["2434"] },
      { title: "社團教室2", name: "", ext: ["2435"] }
    ]
  },
  {
    id: "lifesci_building",
    category: "buildings",
    categoryName: "特色大樓與場館",
    title: "生科大樓",
    color: "#15803D", // 森綠
    lightColor: "#F0FDF4",
    borderColor: "#BBF7D0",
    icon: "hammer",
    directPhone: "",
    fax: "",
    items: [
      { title: "體育器材室", name: "", ext: ["1811"] },
      { title: "烹飪教室", name: "", ext: ["1822"] },
      { title: "生活科技教室", name: "", ext: ["1821"] },
      { title: "家政教室", name: "", ext: ["1822"] }
    ]
  }
];
