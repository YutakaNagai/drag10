<script setup>
import { ref, reactive, onMounted } from 'vue'
import { supabase } from './supabase'
import CONST from './utils/consts'

let user_name = ref('')

const changeName = (event) => {
  user_name.value =
    `${CONST.name1[Math.floor(Math.random() * CONST.name1.length)]} ${CONST.name2[Math.floor(Math.random() * CONST.name2.length)]}`
  localStorage.setItem('user_name', user_name.value)
}

const local_name = localStorage.getItem('user_name')
if(local_name){
  user_name.value = local_name
} else {
  changeName()
}

const getRecords = async () => {
  const formatDate = (date) => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const dateStr =
      year +
      "-" +
      String(month).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0")
    return dateStr
  }

  const today = new Date()

  let startDate
  let endDate = `${formatDate(today)} 14:59:59`

  if(ranking_term.value === 'daily') {
    // デイリーランキング
    const yesterday = new Date(today.getTime())
    yesterday.setDate(yesterday.getDate() - 1)

    startDate = formatDate(yesterday)
  } else if (ranking_term.value === 'weekly') {
    // ウィークリーランキング
    const lastWeek = new Date(today.getTime())
    lastWeek.setDate(lastWeek.getDate() - 7)

    startDate = formatDate(lastWeek)
  } else if (ranking_term.value === 'monthly') {
    // マンスリーランキング
    const month = new Date(today.getTime())
    month.setMonth(month.getMonth() - 1)

    startDate = formatDate(month)
  } else {
    // トータルランキング
    startDate = formatDate(new Date(0))
  }

  startDate += " 15:00:00"

  let { data, error, status } = await supabase
    .from('surround_card_scores')
    .select('user_name, score, created_at')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('score', {ascending: false})
    .order('created_at', {ascending: false})
    .limit(10);
  state.records = data;
};

// 画面表示時のランキング期間
let ranking_term = ref('daily')

getRecords()

const addRecord = async (user_name, score) => {
  const { data, error } = await supabase
    .from('surround_card_scores')
    .insert([{ user_name, score}]);
};

const areaLength = ref(10)

// ゲーム中かどうか
let isGaming = ref(false)

// ドラッグ開始時の座標設定
const dragStart = (e) => {
  if (isGaming.value) {
    const event = e?e:window.event
    const elem = document.getElementById("rect")
    left = event.clientX
    top = event.clientY
    elem.style.left = `${left}px`
    elem.style.top = `${top}px`
    elem.style.display = "block"
    selectMouse()
    document.onmousemove = selectMouse
  }
}

// タッチ開始時の座標設定
const touchStart = (e) => {
  if (isGaming.value) {
    const event = e?e:window.event
    const elem = document.getElementById("rect")
    left = event.changedTouches[0].clientX
    top = event.changedTouches[0].clientY
    elem.style.left = `${left}px`
    elem.style.top = `${top}px`
    elem.style.display = "block"
    selectTouch()
    document.ontouchmove = selectTouch
  }
}

// ドラッグ中の座標設定
const selectMouse = (e) => {
  const event = e?e:window.event
  const elem = document.getElementById("rect")

  // X、Yの増加量を取得
  const movingLeft = event.clientX - left
  const movingTop = event.clientY - top

  // 増加量が負数（左や上へのドラッグ）の場合はleft,topを修正
  if(movingLeft < 0) {
    elem.style.left = `${left + movingLeft}px`
  }
  if(movingTop < 0) {
    elem.style.top = `${top + movingTop}px`
  }

  // 絶対値で幅と高さを設定
  elem.style.width = `${Math.abs(movingLeft)}px`
  elem.style.height = `${Math.abs(movingTop)}px`

  isInclude()
}

// タッチ中の座標設定
const selectTouch = (e) => {
  const event = e?e:window.event
  const elem = document.getElementById("rect")

  // X、Yの増加量を取得
  const movingLeft = event.changedTouches[0].clientX - left
  const movingTop = event.changedTouches[0].clientY - top

  // 増加量が負数（左や上へのドラッグ）の場合はleft,topを修正
  if(movingLeft < 0) {
    elem.style.left = `${left + movingLeft}px`
  }
  if(movingTop < 0) {
    elem.style.top = `${top + movingTop}px`
  }

  // 絶対値で幅と高さを設定
  elem.style.width = `${Math.abs(movingLeft)}px`
  elem.style.height = `${Math.abs(movingTop)}px`

  isInclude()
}

const isInclude = () => {
  const elem = document.getElementById("rect")
  const rect = elem.getBoundingClientRect()

  const cards = document.getElementsByClassName("number_card")

  for(let i = 0; i < cards.length; i++){
    // 各カードの矩形範囲を取得
    const card = cards[i]
    const cardRect = card.getBoundingClientRect()

    // 前回の選択内容を削除
    card.classList.remove("selected")

    // ドラッグの矩形内にカードが含まれているか判定
    if(cardRect.left > rect.left
      && cardRect.left + cardRect.width < rect.left + rect.width
      && cardRect.top > rect.top
      && cardRect.top + cardRect.height < rect.top + rect.height
      && card.style.opacity !== '0'
    ){
        console.log('card', i, ' is include :>> ');
        card.classList.add("selected")
    }
  }
}

// ドラッグイベント終了
const dragEnd = (e) => {
  if (isGaming.value) {
    let sum = 0

    const selectedCards = document.getElementsByClassName("selected")

    for (let i = 0; i < selectedCards.length; i++) {
      sum += Number(selectedCards[i].textContent)
    }

    if(sum === 10) {
      for(let i = 0; i < selectedCards.length; i++){
        const card = selectedCards[i]
        card.style.opacity = "0"
      }
      erased.value += selectedCards.length

      // 一度に消した枚数 - 2 をボーナスとしてスコアに加算
      bonus.value = (selectedCards.length - 2).toFixed(2)
      remaining_time += Number(bonus.value)
      window.setTimeout(() => {
      remaining_time_ref.value = remaining_time
        bonus.value = 0
      }, 2000)
    }

    document.onmousemove = null
    document.ontouchmove = null
  }
}


let left = 0
let top = 0

function handleTouchMove(e) {
  e.preventDefault();
}


// カード配列の作成
const array = []
let arraySum = 0

for(let i = 0; i < areaLength.value; i++){
  array[i] = []
  for(let j = 0; j < areaLength.value; j++){
    let num
    // 最後のカードは「10 - 合計値を10で割ったあまり」で算出
    if(i === areaLength.value - 1 && j === areaLength.value - 1) {
      num = 10 - (arraySum % 10)
      // 最後のカードが6以上の場合、1個前からやり直し
      if(num > 5){
        arraySum = arraySum - (array[i][j] || 0) - array[i][j-1]
        j = 8
      }
    } else {
      // 1以上5以下の数値を各カードに設定
      num = Math.floor((Math.random(10) * 5) + 1)
    }
    array[i][j] = num

    // 最後のカード算出のため合計値を更新
    arraySum += num
  }
}
console.log('全カードの合計 :>> ', arraySum);

const state = reactive({
  array,
  records: [],
})

const size = ref(0)
const outerRef = ref(null)
// 消した数
let erased = ref(0)
// ローカルの最高記録
let best = ref(localStorage.getItem('best') || 0)
// 同時消しボーナス
let bonus = ref(0)

// 制限時間の秒数
const max_time = 60
// 制限時間
let limit_time = ref(max_time)
// 残り時間
let remaining_time = max_time
let remaining_time_ref = ref(max_time)

onMounted(() => {
  const outerDom = outerRef.value
  const outerRect = outerDom.getBoundingClientRect()


  // 画面の縦横を取得
  const displayWidthPx = window.innerWidth
  const displayHeightPx = window.innerHeight

  let cardSizeRate
  if (displayWidthPx < displayHeightPx) {
    // 画面が縦長の場合
    const sizePx = outerRect.width / (areaLength.value + 1)
    cardSizeRate = sizePx / displayWidthPx
  } else {
    // 画面が横長の場合
    const sizePx = outerRect.height * 10 / (areaLength.value + 1)
    cardSizeRate = sizePx / displayHeightPx
  }

  // 算出したカードサイズをsvhに修正してrefに設定
  size.value = ref(cardSizeRate * 100)
})

const isCounting = ref(false)
const before_game_countdown = ref(3)

const gameStart = () => {
  // ゲームのリセット処理
  // TODO: ゲーム開始時に画面をTOPに戻したい
  erased.value = 0
  limit_time.value = max_time
  // 残り時間
  remaining_time = max_time
  remaining_time_ref.value = max_time

  document.addEventListener('touchmove', handleTouchMove, { passive: false })


  document.addEventListener('mousedown', dragStart)
  document.addEventListener('touchstart', touchStart)
  document.addEventListener('mouseup', dragEnd)
  document.addEventListener('touchend', dragEnd)

  // ゲーム開始前のカウントダウン
  isCounting.value = true
  const countdown_interval = setInterval(() => {
    before_game_countdown.value = Number(before_game_countdown.value) - 1
    if(before_game_countdown.value === 0) {
      clearInterval(countdown_interval);
      isGaming.value = true
      gameTimer()
      before_game_countdown.value = 3
      isCounting.value = false
    }
  }, 1000);
}

const gameEnd = () => {
  isGaming.value = false

  document.removeEventListener('mousedown', dragStart)
  document.removeEventListener('touchstart', touchStart)
  document.removeEventListener('mouseup', dragEnd)
  document.removeEventListener('touchend', dragEnd)

  getRecords()
  document.removeEventListener('touchmove', handleTouchMove)
}

const gameTimer = () => {
  // 小数点以下の桁数（1 or 2が設定可能）
  const after_dp = 2

  let reload_interval = 1
  let drawing_interval = 1000
  for (let i = 0; i < after_dp; i++) {
    reload_interval /= 10
    drawing_interval /= 10
  }
  console.log('タイマー設定: ', drawing_interval, 'ms ごとに ', reload_interval, '減少');

  if(isGaming.value){
    const timerAction = setInterval(() => {
      const counter = reload_interval.toFixed(after_dp);
      remaining_time -= counter

      // refに反映
      remaining_time_ref.value = remaining_time.toFixed(after_dp)
      if (remaining_time <= 0) {
        clearInterval(timerAction);
        remaining_time_ref.value = "0.00"
        document.getElementById('rect').style.display = 'none'

        // DBにレコード追加
        addRecord(user_name.value, erased.value)
        console.log('スコア登録完了 :>>\nuser_name: ', user_name.value, '\nscore: ', erased.value);

        // ローカルの最高記録更新
        const bestHistory = Number(localStorage.getItem('best'))
        if(bestHistory < erased.value) {
          best.value = erased.value
          localStorage.setItem('best', erased.value)
        }

        gameEnd()
      }
    }, drawing_interval);
  }
}

// 表示ランキングの変更
const changeRanking = async (term) => {
  ranking_term.value = term

  getRecords()
}

</script>

<template>
  <span>合計で10になるカードを囲んで消すゲーム</span>
  <div class="bg_card">
    <div class="name_block">
      <span class="user_name">名前: {{ user_name }}</span>　
      <button class="rename_btn" v-show="!isCounting && !isGaming" style="z-index: 101" @click="changeName()">改名！</button>
    </div>

    <div>
      <div class="progress_block">
        <span>残り時間: </span>
        <div class="progress_bar">
          <progress id="time_limit" :max="limit_time" :value="remaining_time_ref"></progress>
          <span class="countdown_text">{{ remaining_time_ref }}秒</span>
          <transition name="bonus">
            <div v-if="bonus !== 0" class="bonus_text">
              同時消し +{{ bonus }}秒
            </div>
          </transition>
        </div>
      </div>
    </div>

    <div>
      <div class="text_block">
        <div class="erase_block">
          <!-- <span class="erase_text">消した枚数:</span> -->
          <img src="./assets/erased.png" class="score_icon" />
          <span class="erase_value">{{ erased }}枚</span>
        </div>
        <div class="score_block">
          <!-- <span class="score_text">最高記録:</span> -->
          <img src="./assets/record.png" class="score_icon" />
          <span class="score_value">{{ best }}枚</span>
        </div>
      </div>
    </div>
    <div id="outer" class="outer" ref="outerRef">
      <template v-if="!isGaming">
        <div class="before_game">
          <button v-if="!isCounting" @click="gameStart()">Start!</button>
          <div v-else class="before_game_countdown">{{ before_game_countdown }}</div>
        </div>
      </template>
      <template v-else>
        <!-- ドラッグ時の矩形 -->
        <div id="rect"></div>
        <div v-for="(iValue, i) in state.array" :key="i">
          <div v-for="(jValue, j) in state.array[i]"
            :key="j"
            :style="`
              display: inline-block;
              left: ${size.value * j}svw;
              top: ${size.value * i}svw;
              width: ${size.value}svw;
              height: ${size.value}svw;`"
          >
            <div
              class="number_card"
              :style="`
                width: ${size.value / 1.5}svw;
                height: ${size.value / 1.5}svw;
                font-size: ${size.value * 0.6}svw`"
            >
              {{ state.array[i][j] }}
            </div>
          </div>
          <br />
        </div>
      </template>
    </div>
  </div>

  <hr />

  <div class="bg_card">
    <div>ランキング</div>
    <div class="ranking_terms">
      <span :class="ranking_term === 'daily' ? 'now_ranking' : ''" @click="changeRanking('daily')">今日</span>
      <span :class="ranking_term === 'weekly' ? 'now_ranking' : ''" @click="changeRanking('weekly')">今週</span>
      <span :class="ranking_term === 'total' ? 'now_ranking' : ''" @click="changeRanking('total')">全期間</span>
    </div>
    <div class="ranking">
      <table>
        <tr>
          <th>順位</th>
          <th>名前</th>
          <th>スコア</th>
        </tr>
        <tr v-for="(record, index) in state.records" :key="record.id">
          <td>{{ index+1 }}</td>
          <td>{{ record.user_name }}</td>
          <td>{{ record.score }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
.bg_card {
  background: whitesmoke;
  padding: 1rem;
  border-radius: 2rem;
  box-shadow: 1svw 1svw 1.5svw 0svw rgba(0, 0, 0, 0.3);
  background: #C9D4CC;
}

.name_block {
  display: flex;
  width: 100%;
  height: 2.5rem;
  align-items: center;
}

.user_name {
  margin: auto auto auto 0;
}

.rename_btn {
  margin: auto 0 auto auto;
}

.progress_block {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3rem;
}

progress {
  width: 50svw;
  height: 1rem;
  border-radius: 100px;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: rgb(172, 172, 172);
}
::-webkit-progress-bar {
   /* プログレスバーの背景色/-webkit- 用 */
  background-color: rgb(172, 172, 172);
}
::-webkit-progress-value {
  /* プログレスバーの進捗部分色/-webkit- 用 */
  background: rgb(34,193,195);
  background: linear-gradient(45deg, rgba(34,193,195,1) 0%, rgba(61,204,168,1) 60%, rgba(186,253,45,1) 100%);
}
::-moz-progress-bar {
  /* プログレスバーの進捗部分色/-moz- 用 */
  background: rgb(34,193,195);
  background: linear-gradient(45deg, rgba(34,193,195,1) 0%, rgba(61,204,168,1) 60%, rgba(186,253,45,1) 100%);
}

.progress_bar {
  position: relative;
}

.countdown_text {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}

.outer {
  /* border: 0.2rem solid burlywood; */
  width: 80svw;
  height: 80svw;
  margin: 0 auto;
  display: flex;
}

.before_game {
  margin: auto;
}

.before_game_countdown {
  color: #CC3030;
  font-size: 10rem;
}

.score_icon {
  width: 3rem;
  vertical-align: middle;
}

.number_card {
  position: relative;
  display: flex;
  justify-content: center;
  border-radius: 10%;
  background: #ffffff;
  top: 15%;
  box-shadow: 0.5svw 0.5svw 1.5svw 0svw rgba(0, 0, 0, 0.3);
  margin: auto;
}

.selected {
  background: #f7c6bd;
}

.text_block {
  display: flex;
  height: 10vh;
  width: 80svw;
  margin: 0 auto;
}

.erase_block {
  margin: 0 1%;
  width: 50%;
  height: 3.5rem;
  border: 0.2rem dashed #c2ffbd;
  line-height: 3.5rem;
  text-align: left;
}
.erase_text {
  margin: auto 1svw;
  float: left;
}
.erase_value {
  margin: auto 1svw;
  float: right;
}

.score_block {
  margin: 0 1%;
  width: 40%;
  height: 3.5rem;
  border: 0.2rem dashed #c2ffbd;
  line-height: 3.5rem;
  justify-content: flex-start;
}

.score_text {
  margin: auto 1svw;
  float: left;
}
.score_value {
  margin: auto 1svw;
  float: right;
}

.bonus_text {
  position: absolute;
  width: 9rem;
  top: -1rem;
  left: -4.7rem;
  bottom: 0;
  right: 0;
  margin: auto;
  z-index: 100;
  color: goldenrod;
}

/* 表示時の状態 */
.bonus-enter-from {
  opacity: 0;
  position: absolute;
  top: 0rem;
}
/* 表示時のアクティブ状態 */
.bonus-enter-active {
  transition: all 0.5s;
}
/* 表示時の終了状態 */
.bonus-enter-to {
  opacity: 1;
  position: absolute;
  top: -1rem;
}
/* 非表示時の状態 */
.bonus-leave-from {
  opacity: 1;
  position: absolute;
  top: -1rem;
}
/* 非表示時のアクティブ状態 */
.bonus-leave-active {
  transition: all .5s;
}
/* 非表示時の終了状態 */
.bonus-leave-to {
  opacity: 0;
  position: absolute;
  top: -2rem;
}

.ranking {
  display: flex;
  justify-content: center;
  font-size: 1rem;
}

.ranking_terms {
  display: flex;
  justify-content: space-around;
  padding: 0rem 1rem;
  font-size: small;
}

.now_ranking {
  color: #f5a500;
  font-weight: bold;
  border-bottom: double #f5a500;
}


div#rect{
display:none;
opacity:0.5;
z-index:100;
position:absolute;
border:solid 1px blue;
background-color:#99f;
}
</style>
