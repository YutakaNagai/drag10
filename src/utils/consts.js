const name1 = [
    '大きい',
    '小さい',
    '新しい',
    '古い',
    '熱い',
    '冷たい',
    '高い',
    '安い',
    'おいしい',
    '忙しい',
    '黒い',
    '赤い',
    '青い',
    '黄色い',
    '白い',
    'きれいな',
    '静かな',
    'うるさい',
    '名の知れた',
    '無名な',
    '元気な',
    '親切な',
    '暇を持て余した',
    '便利な',
    '都合のいい',
    '素敵な',
    '面白い',
    '人に好かれる',
    'お茶に合う',
    'コーラに合う',
    'のどが渇いた',
    'アツアツの',
    'ヒエヒエの',
    '眠たい',
    '希望の',
    'テレビで見た',
    'かっこいい',
    'かわいい',
    '美しい',
    '不思議な',
    '大志を抱いた',
    '光る',
    'たくましい',
    '賢い',
    'すべてを司る',
    '全知全能の',
    'おしゃれな',
    '流行の',
    '臆病な',
    '怖がりな',
    '素朴な',
    'さみしがりな',
    'いじっぱりな',
    'やんちゃな',
    '勇敢な',
    'ずぶとい',
    'わんぱくな',
    '能天気な',
    'のんきな',
    '控えめな',
    'おっとりした',
    'うっかりやな',
    '冷静な',
    '穏やかな',
    'おとなしい',
    '慎重な',
    '生意気な',
    '臆病な',
    'せっかちな',
    '陽気な',
    '無邪気な',
    '照れ屋な',
    '頑張り屋な',
    '素直な',
    '気まぐれな',
    'まじめな',
    '伝説の',
    '幻の',
    '野生の',
    '捕まえられた',
    '飼いならされた',
    'なついている',
    '買われた',
    '虹色の',
    '金色の',
    '銀色の',
    '珍しい',
    'SSRの',
    'SRの',
    'Rの',
    'エースの',
    'がんばった',
    'やりきった',
    '疲れた',
    'やわらかい',
    'かたい',
    '潤った',
    '干からびた',
    '詳しい',
    'テレビっ子な',
    '読書好きの',
    'ゲーマーな',
    'スポーツマンな',
    '才能あふれる',
    '昔懐かしい',
]

const name2 = [
    'アスパラ',
    'アーティチョーク',
    'アボカド',
    'いちご',
    'イチジク',
    'ウコン',
    '梅',
    'エシャレット',
    '枝豆',
    'えのきだけ',
    'エリンギ',
    'グリーンピース',
    'パイナップル',
    'メロン',
    'カリフラワー',
    'カリン',
    '柑橘',
    'キウイ',
    'キクイモ',
    'キャベツ',
    'キュウリ',
    'キンカン',
    'ぎんなん',
    '空心菜',
    '栗',
    'クレソン',
    'シイタケ',
    'ししとう',
    'じゃがいも',
    '春菊',
    'ショウガ',
    'スターフルーツ',
    'ズッキーニ',
    'セロリ',
    'スナップエンドウ',
    'ソラマメ',
    '大根',
    '大豆',
    'たけのこ',
    '玉ねぎ',
    '青梗菜',
    'とうもろこし',
    'トマト',
    'ドラゴンフルーツ',
    '梨',
    'ナス',
    '夏みかん',
    'なばな',
    'にら',
    'にんじん',
    'にんにく',
    'にんにくの芽',
    'ネギ',
    '白菜',
    'パクチー',
    'パセリ',
    'バジル',
    'はやとうり',
    'ビーツ',
    'ピーマン',
    'びわ',
    'ふき',
    'ぶどう',
    'すもも',
    'ブロッコリー',
    'ほうれん草',
    'まいたけ',
    'マスカット',
    'マッシュルーム',
    '松茸',
    '水菜',
    'ミョウガ',
    '芽キャベツ',
    '桃',
    'もやし',
    'モロヘイヤ',
    'ヤーコン',
    '山芋',
    'ゆず',
    '西洋梨',
    '落花生',
    'りんご',
    'ルッコラ',
    'レモン',
    'レンコン',
    'わさび',
    'スイカ',
    '式部草',
    'バナナ',
    'レタス',
    'マンゴー',
    'ブルーベリー',
    'パプリカ',
    'オカヒジキ',
    'オクラ',
    '柿',
    'かぶ',
    'かぼす',
    'かぼちゃ',
    'コスレタス',
    'ゴボウ',
    'ゴーヤ',
    'コールラビ',
    '小松菜',
    '米',
    'サクランボ',
    'さつまいも',
    '里芋',
    'さやいんげん',
    'アオダイ',
    'アオリイカ',
    'アカハタ',
    'アカムツ',
    'アコウダイ',
    'アサリ',
    'アジ',
    'アナゴ',
    'アマダイ',
    'アユ',
    'アワビ',
    'イカナゴ',
    'イサキ',
    'イワシ',
    'ウナギ',
    'ウニ',
    'オニカサゴ',
    'カキ',
    'カジキ',
    'カツオ',
    'カマス',
    'カワハギ',
    'カンパチ',
    'キス',
    'キビナゴ',
    'キンメダイ',
    'クルマエビ',
    'クロダイ',
    'ケンサキイカ',
    'コチ',
    '昆布',
    'サクラエビ',
    'サクラマス',
    'サヨリ',
    'サワラ',
    'サンマ',
    'シマアジ',
    'シラウオ',
    'シラエビ',
    'しらす',
    'スズキ',
    'スルメイカ',
    'タコ',
    'タチウオ',
    'タラバガニ',
    'トビウオ',
    'トリガイ',
    'ニシン',
    'ハタハタ',
    'ハマグリ',
    'ハマダイ',
    'ハモ',
    'ブリ',
    'ホウボウ',
    'ホタテ',
    'ホタルイカ',
    'マグロ',
    'マサバ',
    'マダイ',
    'メイタガレイ',
    'メバル',
]

export default {
    name1,
    name2
}