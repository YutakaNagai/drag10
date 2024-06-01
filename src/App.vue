<script setup>
import { ref, reactive, onMounted } from 'vue'

const areaLength = ref(10)

// ゲーム中かどうか
let isGaming = true

// ドラッグ開始時の座標設定
const dragStart = (e) => {
  if (isGaming) {
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
  if (isGaming) {
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
}

// ドラッグイベント終了
const dragEnd = (e) => {
  const event = e?e:window.event
  const elem = document.getElementById("rect")
  const rect = elem.getBoundingClientRect()

  const cards = document.getElementsByClassName("number_card")

  let sum = 0

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
      && card.style.opacity !== '0'){
        console.log('card', i, ' is include :>> ');
        card.classList.add("selected")
        sum += Number(card.textContent)
      }
  }

  const selectedCards = document.getElementsByClassName("selected")

  if(sum === 10) {
    for(let i = 0; i < selectedCards.length; i++){
      const card = selectedCards[i]
      card.style.opacity = "0"
    }
    erased.value += selectedCards.length

    // 一度に消した枚数 - 2 をボーナスとしてスコアに加算
    bonus.value = selectedCards.length - 2
    score.value += selectedCards.length + bonus.value
    window.setTimeout(() => {
      bonus.value = 0
    }, 2000)
  }

  document.onmousemove = null
  document.ontouchmove = null
}


let left = 0
let top = 0

function handleTouchMove(e) {
  e.preventDefault();
}
document.addEventListener('touchmove', handleTouchMove, { passive: false })
document.onmousedown = dragStart
document.ontouchstart = touchStart
document.onmouseup = dragEnd
document.ontouchend = dragEnd


// カード配列の作成
const array = []
let arraySum = 0

let arrayCheck = false

while(!arrayCheck) {
  for(let i = 0; i < areaLength.value; i++){
    array[i] = []
    for(let j = 0; j < areaLength.value; j++){
      let num
      // 最後のカードは「10 - 合計値を10で割ったあまり」で算出
      if(i === areaLength.value - 1 && j === areaLength.value - 1) {
        num = 10 - (arraySum % 10)
        // 最後のカードが5以下ならカード配列作成終了
        if(num <= 5) {
          arrayCheck = true
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
}

const state = reactive({
  array,
})

const size = ref(0)
const outerRef = ref(null)
// 消した数
let erased = ref(0)
// スコア
let score = ref(0)
// 同時消しボーナス
let bonus = ref(0)

// 制限時間の秒数
const max_time = 30
// 制限時間
let limit_time = ref(max_time)
// 残り時間
let remaining_time = ref(max_time)

onMounted(() => {
  const outerDom = outerRef.value
  const outerRect = outerDom.getBoundingClientRect()

  size.value = ref(outerRect.width / (areaLength.value + 1))

  let counter = remaining_time.value;

  // 小数点以下の桁数（1 or 2が設定可能）
  const after_dp = 2

  let reload_interval = 1
  let drawing_interval = 1000
  for (let i = 0; i < after_dp; i++) {
    reload_interval /= 10
    drawing_interval /= 10
  }
  console.log('タイマー設定: ', drawing_interval, 'ms ごとに ', reload_interval, '減少');


  const timerAction = setInterval(() => {
    counter = (counter - reload_interval).toFixed(after_dp);

    // refに反映
    remaining_time.value = counter
    if (counter <= 0) {
      clearInterval(timerAction);
      isGaming = false
      document.getElementById('rect').style.display = 'none'
    }
  }, drawing_interval);
})

</script>

<template>
  <span>合計で10になるカードを囲んで消すゲーム</span>

  <div>
    <div class="progress_block">
      <span>残り時間: </span>
      <div class="progress_bar">
        <progress id="time_limit" :max="30" :value="remaining_time"></progress>
        <span class="countdown_text">{{ remaining_time }}秒</span>
      </div>
    </div>
  </div>

  <div>
    <div class="text_block">
      <div class="erase_block">
        <span class="erase_text">消した枚数:</span>
        <span class="erase_value">{{ erased }}枚</span>
      </div>
      <div class="score_block">
        <span class="score_text">スコア:</span>
        <span class="score_value">{{ score }}点</span>
        <br />
        <div>
          <transition name="bonus">
            <div v-if="bonus !== 0" class="bonus_text">
              同時消し +{{ bonus }}点
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
  <div id="outer" class="outer" ref="outerRef">
    <!-- ドラッグ時の矩形 -->
    <div id="rect"></div>
    <div v-for="(iValue, i) in state.array" :key="i">
      <div v-for="(jValue, j) in state.array[i]"
        :key="j"
        :style="`
          display: inline-block;
          left: ${size.value * j}px;
          top: ${size.value * i}px;
          width: ${size.value}px;
          height: ${size.value}px;`"
      >
        <div
          class="number_card"
          :style="`
            width: ${size.value / 1.5}px;
            height: ${size.value / 1.5}px;`"
        >
          {{ state.array[i][j] }}
        </div>
      </div>
      <br />
    </div>
  </div>
</template>

<style scoped>
.progress_block {
  display: flex;
  justify-content: center;
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
  border: 0.2rem solid burlywood;
  width: 80svw;
  margin: 0 auto;
  display: flex;
}

.number_card {
  position: relative;
  display: flex;
  justify-content: center;
  border-radius: 10%;
  background: whitesmoke;
  top: 15%;
  box-shadow: 0.5svw 0.5svw 1.5svw 0svw rgba(0, 0, 0, 0.3);
  margin: auto;
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
  border: 0.2rem dashed skyblue;
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
  border: 0.2rem dashed skyblue;
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
  position: relative;
  top: -4.5rem;
  left: 0.47rem;
  z-index: 100;
  color: goldenrod;
}

/* 表示時の状態 */
.bonus-enter-from {
  position: relative;
  opacity: 0;
  top: -3.5rem;
}
/* 表示時のアクティブ状態 */
.bonus-enter-active {
  transition: all 0.5s;
}
/* 表示時の終了状態 */
.bonus-enter-to {
  position: relative;
  opacity: 1;
  top: -4.5rem;
}
/* 非表示時の状態 */
.bonus-leave-from {
  position: relative;
  opacity: 1;
  top: -4.5rem;
}
/* 非表示時のアクティブ状態 */
.bonus-leave-active {
  transition: all .5s;
}
/* 非表示時の終了状態 */
.bonus-leave-to {
  position: relative;
  opacity: 0;
  top: -5.5rem;
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
