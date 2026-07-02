/* 青山 Peak Tea — 菜單資料
   依 peak-tea.com 現行菜單整理，供圖片式點餐頁面使用 */

const SITE = {
  name: '青山',
  nameEn: 'PEAK TEA',
  slogan: '一杯茶，一座山的高度',
  phone: '02-2345-6789',
};

/* 茶葉分級（僅為說明用，非可單點商品） */
const TEA_GRADES = [
  { name: '春青', aroma: '花香', taste: '輕', alt: '800 - 1200 M', m: 30, l: 35 },
  { name: '夏青', aroma: '木質香', taste: '重', alt: '800 - 1200 M', m: 30, l: 35 },
  { name: '秋青', aroma: '奶香', taste: '中', alt: '1200 - 1500 M', m: 40, l: 45 },
  { name: '冬青', aroma: '清香', taste: '輕', alt: '1300 - 1600 M', m: 55, l: 60, featured: true },
];

/* 分類 */
const CATEGORIES = [
  { key: 'wu',   name: '無', sub: '無咖啡因', desc: '不含咖啡因，溫和順口的茶飲選擇' },
  { key: 'tiao', name: '調', sub: '特調茶飲', desc: '冬露系列最低糖量為半糖' },
  { key: 'liao', name: '料', sub: '加料茶飲', desc: '珍珠、奶蓋、菜燕，滿滿誠意配料' },
  { key: 'cha',  name: '茶', sub: '經典純茶', desc: '純粹茶香，品味山頭氣' },
  { key: 'gai',  name: '蓋', sub: '鮮奶油特調', desc: '法國 Elle&Vire 鮮奶油特調，僅供少冰' },
  { key: 'nai',  name: '奶', sub: '奶茶那堤', desc: '那堤系列可升級燕麥奶（M+10 / L+15）' },
  { key: 'guo',  name: '果', sub: '鮮果茶飲', desc: '真材實料鮮果製作，不提供無糖' },
];

/* 加料（單點加購） */
const ADDONS = [
  { key: 'amber-pearl',   name: '琥珀珍珠', price: 10 },
  { key: 'buckwheat-pearl', name: '蕎麥珍珠', price: 15 },
  { key: 'salt-cream',    name: '海鹽奶蓋', price: 20 },
  { key: 'buckwheat-cream', name: '蕎麥奶蓋', price: 20 },
  { key: 'jelly',         name: '菜燕', price: 10 },
  { key: 'tea-jelly',     name: '青茶茶凍', price: 10 },
  { key: 'tea-hunkwe',    name: '青茶婚貴', price: 10 },
  { key: 'almond-jelly',  name: '杏仁凍', price: 10 },
];

/* 甜度（value 為百分比，0 = 無糖） */
const SWEETNESS = [
  { key: 'full',    name: '正常甜', pct: 100 },
  { key: 'less',    name: '少糖', pct: 70 },
  { key: 'half',    name: '半糖', pct: 50 },
  { key: 'light',   name: '微糖', pct: 30 },
  { key: 'trace',   name: '1分糖', pct: 10 },
  { key: 'zero',    name: '無糖', pct: 0 },
];

/* 冰量 */
const ICE = [
  { key: 'full',  name: '正常冰' },
  { key: 'less',  name: '少冰' },
  { key: 'trace', name: '微冰' },
  { key: 'zero',  name: '去冰' },
  { key: 'room',  name: '常溫' },
  { key: 'hot',   name: '溫熱' },
];

/*
  products[].art 供 js/art.js 產生風格化杯身圖：
  base / base2   液體漸層色
  cream          奶蓋/奶泡顏色（無則不畫）
  boba           是否畫珍珠
  bits           是否畫果肉/凍類顆粒
*/
const PRODUCTS = [
  // 無 -----------------------------------------------------------
  { id: 'wu-01', category: 'wu', name: '東方菊花茶', m: 45, l: 55,
    desc: '乾燥杭菊慢火沖煮，花香清雅回甘，喝來像秋日午後的一場散步。',
    art: { base: '#e8c874', base2: '#f6e4a8' } },
  { id: 'wu-02', category: 'wu', name: '西穀蕎麥茶', m: 30, l: 40,
    desc: '烘焙蕎麥的堅果焦香，樸實無負擔，是山居人家的日常茶湯。',
    art: { base: '#d9a441', base2: '#f0cf85' } },
  { id: 'wu-03', category: 'wu', name: '南非國寶茶', m: 40, l: 50,
    desc: '南非路易波士茶天然回甜，帶著淡淡蜜香與木質尾韻。',
    art: { base: '#c1652f', base2: '#e8965a' } },
  { id: 'wu-04', category: 'wu', name: '北風桂花玄米茶', m: 35, l: 45, recommended: true,
    desc: '炒香玄米搭配桂花，米香與花香交織，冬日暖胃首選。',
    art: { base: '#e0b653', base2: '#f3dca0' } },

  // 調 -----------------------------------------------------------
  { id: 'tiao-01', category: 'tiao', name: '青山綠水', m: 35, l: 40, recommended: true,
    desc: '春青綠茶與清水的極簡組合，喝的就是那口最原始的山頭氣。',
    art: { base: '#a8b83f', base2: '#d7e08a' } },
  { id: 'tiao-02', category: 'tiao', name: '春青菊花', m: 45, l: 55,
    desc: '春青茶湯揉入菊花香氣，清爽花香茶飲，尾韻回甘不膩。',
    art: { base: '#e3c96a', base2: '#f5e5ab' } },
  { id: 'tiao-03', category: 'tiao', name: '蕎麥冬露', m: null, l: 50, recommended: true,
    minSweet: 50,
    desc: '冬青茶湯以蕎麥提香，質地圓潤，僅供大杯，最低半糖品飲最佳風味。',
    art: { base: '#b5762f', base2: '#dba86a' } },
  { id: 'tiao-04', category: 'tiao', name: '春青冬露', m: null, l: 50,
    minSweet: 50,
    desc: '春青與冬露工法的相遇，層次分明，僅供大杯。',
    art: { base: '#c9a04a', base2: '#e8cf94' } },
  { id: 'tiao-05', category: 'tiao', name: '菊花冬露', m: null, l: 55, recommended: true,
    minSweet: 50,
    desc: '冬露工法融合菊花清香，溫潤生津，僅供大杯。',
    art: { base: '#d9b95a', base2: '#f0dfa8' } },
  { id: 'tiao-06', category: 'tiao', name: '多多綠水', m: null, l: 55,
    minSweet: 50,
    desc: '乳酸的酸甜與淡雅的茶香相互融合，彷彿回到了青澀年少的初戀時光。僅供大杯。',
    art: { base: '#e0a95c', base2: '#f2cf9a', cream: '#f7ecd8' } },

  // 料 -----------------------------------------------------------
  { id: 'liao-01', category: 'liao', name: '菜燕春青', m: 40, l: 45, recommended: true,
    desc: '手工菜燕搭配春青茶湯，Q彈涼糕般的口感是女孩們的最愛。',
    art: { base: '#9ab34a', base2: '#cfe08f', bits: '#e8f0c0' } },
  { id: 'liao-02', category: 'liao', name: '菜燕奶茶', m: 55, l: 60, recommended: true,
    desc: '濃郁奶茶裡藏著滑嫩菜燕，一口茶香一口涼糕，雙重享受。',
    art: { base: '#8a5a34', base2: '#c9a06a', bits: '#f0e2c8' } },
  { id: 'liao-03', category: 'liao', name: '杏仁凍春青', m: 40, l: 45,
    desc: '杏仁凍清甜綿密，襯著春青茶香，是夏天最沁涼的甜點級茶飲。',
    art: { base: '#b6c96a', base2: '#e2eda0', bits: '#f5f2e0' } },
  { id: 'liao-04', category: 'liao', name: '青茶婚貴奶茶', m: 55, l: 60,
    desc: '婚貴凍軟糯彈牙，融進醇厚奶茶，口口都是驚喜。',
    art: { base: '#9a6b3f', base2: '#d1a373', bits: '#e8d3a8' } },
  { id: 'liao-05', category: 'liao', name: '琥珀珍珠奶茶', m: 55, l: 60, recommended: true,
    desc: '熬煮兩小時的琥珀珍珠，焦糖香氣濃郁，經典中的經典。',
    art: { base: '#8a5a2f', base2: '#c9925a', boba: '#4a2c15' } },
  { id: 'liao-06', category: 'liao', name: '蕎麥珍珠奶茶', m: 60, l: 65,
    desc: '蕎麥珍珠比一般珍珠更有嚼勁，搭配奶茶香氣層次更豐富。',
    art: { base: '#7a4e2a', base2: '#c08a52', boba: '#3e2412' } },
  { id: 'liao-07', category: 'liao', name: '青茶凍天蟬那堤', m: 65, l: 75,
    desc: '天蟬紅茶那堤加上青茶凍，奶香茶韻與涼糕口感一次滿足。',
    art: { base: '#c9a373', base2: '#ecd9b8', bits: '#8fae4a' } },
  { id: 'liao-08', category: 'liao', name: '琥珀珍珠天蟬那堤', m: 65, l: 75,
    desc: '琥珀珍珠遇上綿密那堤，濃醇奶香裡藏著焦糖珍珠的驚喜。',
    art: { base: '#c9a373', base2: '#ecd9b8', boba: '#4a2c15' } },
  { id: 'liao-09', category: 'liao', name: '蕎麥珍珠夏青那堤', m: 65, l: 75, recommended: true,
    desc: '夏青茶香厚實，搭配蕎麥珍珠與滑順那堤，口感層次最豐富。',
    art: { base: '#b98a52', base2: '#e0c090', boba: '#3e2412' } },

  // 茶 -----------------------------------------------------------
  { id: 'cha-01', category: 'cha', name: '綠水', m: 25, l: 30,
    desc: '最純粹的一杯，清澈茶湯只留下茶葉本身的甘甜。',
    art: { base: '#b7c95a', base2: '#e2eda0' } },
  { id: 'cha-02', category: 'cha', name: '天蟬紅茶', m: 35, l: 40, recommended: true,
    desc: '蟬蜜香紅茶，蜜香馥郁，茶湯紅豔透亮。',
    art: { base: '#a8502f', base2: '#d98a5a' } },

  // 蓋 -----------------------------------------------------------
  { id: 'gai-01', category: 'gai', name: '蕎麥奶蓋 綠水', m: 45, l: 50,
    iceFixed: 'less',
    desc: '法國鮮奶油特調奶蓋，覆蓋在清爽綠水之上，鹹甜交織，僅供少冰。',
    art: { base: '#a8b83f', base2: '#d7e08a', cream: '#f5efe0' } },
  { id: 'gai-02', category: 'gai', name: '蕎麥奶蓋 玄米茶', m: 55, l: 65, recommended: true,
    iceFixed: 'less',
    desc: '玄米茶香厚實，鮮奶油奶蓋綿密如雲，僅供少冰。',
    art: { base: '#cfa040', base2: '#f0dca0', cream: '#f5efe0' } },
  { id: 'gai-03', category: 'gai', name: '海鹽奶蓋 春青', m: 50, l: 55, recommended: true,
    iceFixed: 'less',
    desc: '春青茶湯配上海鹽奶蓋，一口鹹一口甜，經典必喝，僅供少冰。',
    art: { base: '#d4c467', base2: '#f0e6b0', cream: '#f5efe0' } },
  { id: 'gai-04', category: 'gai', name: '海鹽奶蓋 紅茶', m: 55, l: 60, recommended: true,
    iceFixed: 'less',
    desc: '紅茶醇厚配上綿密海鹽奶蓋，濃郁不苦澀，僅供少冰。',
    art: { base: '#a8502f', base2: '#d98a5a', cream: '#f5efe0' } },
  { id: 'gai-05', category: 'gai', name: '海鹽奶蓋 輕蘋香茶', m: 80, l: null, recommended: true,
    iceFixed: 'less',
    desc: '輕蘋果香氣清爽迷人，海鹽奶蓋更添層次，僅供中杯、少冰。',
    art: { base: '#e0708a', base2: '#f5c0cc', cream: '#f5efe0' } },

  // 奶 -----------------------------------------------------------
  { id: 'nai-01', category: 'nai', name: '山峰奶茶', m: 45, l: 50,
    desc: '經典奶茶比例，茶香奶香平衡完美，那堤系列可升級燕麥奶。',
    art: { base: '#8a5e36', base2: '#d1ab7c' } },
  { id: 'nai-02', category: 'nai', name: '夏青那堤', m: 50, l: 60, recommended: true,
    desc: '夏青茶氣厚重帶木質香，融入綿密那堤，尾韻悠長。可升級燕麥奶。',
    art: { base: '#c08a4a', base2: '#ecd2a0' } },
  { id: 'nai-03', category: 'nai', name: '蕎麥那堤', m: 50, l: 65, recommended: true,
    desc: '蕎麥焙火香氣搭配滑順那堤，溫潤不刺激。可升級燕麥奶。',
    art: { base: '#a87840', base2: '#e0be90' } },
  { id: 'nai-04', category: 'nai', name: '天蟬那堤', m: 55, l: 65, recommended: true,
    desc: '天蟬紅茶蜜香混著奶香，濃醇滑順，招牌人氣品項。可升級燕麥奶。',
    art: { base: '#a8623f', base2: '#e0a684' } },

  // 果 -----------------------------------------------------------
  { id: 'guo-01', category: 'guo', name: '白甘蔗春青', m: 55, l: 60, recommended: true,
    noZeroSugar: true,
    desc: '現榨白甘蔗清甜自然，融合春青茶香，不提供無糖。',
    art: { base: '#e3cf8a', base2: '#f6ecd0' } },
  { id: 'guo-02', category: 'guo', name: '香檸綠水', m: 55, l: 60,
    noZeroSugar: true,
    desc: '新鮮檸檬片手工壓榨，酸甜清爽解膩，不提供無糖。',
    art: { base: '#c7d95a', base2: '#eaf2a8', bits: '#f5f7d8' } },
  { id: 'guo-03', category: 'guo', name: '柳丁綠水', m: 65, l: 70,
    noZeroSugar: true,
    desc: '新鮮柳丁果肉滿滿，酸甜果香四溢，不提供無糖。',
    art: { base: '#e0973f', base2: '#f5c98a', bits: '#f9dfae' } },
  { id: 'guo-04', category: 'guo', name: '紅柚綠水', m: 65, l: 70, recommended: true,
    noZeroSugar: true,
    desc: '紅柚果肉清香微苦回甘，搭配綠水更顯清爽，不提供無糖。',
    art: { base: '#e0637a', base2: '#f3a8b8', bits: '#f9cdd8' } },
  { id: 'guo-05', category: 'guo', name: '橘子春青', m: 65, l: 70, recommended: true,
    noZeroSugar: true,
    desc: '橘子鮮果香氣奔放，酸甜比例恰到好處，不提供無糖。',
    art: { base: '#e88b30', base2: '#f7c37a', bits: '#fbe0ae' } },
  { id: 'guo-06', category: 'guo', name: '荔枝春青', m: 70, l: 75, recommended: true,
    noZeroSugar: true,
    desc: '荔枝香氣濃郁迷人，內含青茶凍增添口感，不提供無糖。',
    art: { base: '#e895a8', base2: '#f7cdd8', bits: '#8fae4a' } },
  { id: 'guo-07', category: 'guo', name: '水梨春青', m: 70, l: 75, recommended: true,
    noZeroSugar: true,
    desc: '清甜多汁的水梨果香，襯著春青茶湯，喝起來輕盈爽口，不提供無糖。',
    art: { base: '#d3dd8a', base2: '#eef3c4' } },
  { id: 'guo-08', category: 'guo', name: '輕蘋香茶', m: 75, l: 80, recommended: true,
    noZeroSugar: true,
    desc: '青蘋果清香微酸，茶香在後段緩緩浮現，不提供無糖。',
    art: { base: '#e0708a', base2: '#f5b8c4' } },
];

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

function getCategory(key) {
  return CATEGORIES.find(c => c.key === key);
}

function getRelatedProducts(product, count = 4) {
  return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, count);
}

function formatPrice(product) {
  if (product.m && product.l) return `M ${product.m} / L ${product.l}`;
  if (product.m && !product.l) return `M ${product.m}（僅供中杯）`;
  if (!product.m && product.l) return `L ${product.l}（僅供大杯）`;
  return '';
}
