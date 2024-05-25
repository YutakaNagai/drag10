<script setup>
import HelloWorld from './components/HelloWorld.vue'
import { ref, reactive, onMounted } from 'vue'

const areaLength = ref(10)

// ドラッグ開始時の座標設定
const dragStart = (e) => {
  const event = e?e:window.event
  const elem = document.getElementById("rect")
  left = event.clientX
  top = event.clientY
  elem.style.left = `${left}px`
  elem.style.top = `${top}px`
  elem.style.display = "block"
  select()
  document.onmousemove = select
}

// ドラッグ中の座標設定
const select = (e) => {
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
}

let left = 0
let top = 0
document.onmousedown = dragStart
document.onmouseup = dragEnd

const array = []
let arraySum = 0

for(let i = 0; i < areaLength.value; i++){
  array[i] = []
  for(let j = 0; j < areaLength.value; j++){
    let num
    if(i === areaLength.value - 1 && j === areaLength.value - 1) {
      num = 10 - (arraySum % 10)
    } else {
      num = Math.floor((Math.random(10) * 5) + 1)
    }
    array[i][j] = num
    arraySum += num
  }
}

const state = reactive({
  array,
})

const size = ref(0)
const outerRef = ref(null)
let erased = ref(0)
let score = ref(0)
let bonus = ref(0)

onMounted(() => {
  const outerDom = outerRef.value
  const outerRect = outerDom.getBoundingClientRect()

  size.value = ref(outerRect.width / (areaLength.value + 1))
})

</script>

<template>
  <div class="text_block">
    <div class="erase_block">
      <span class="score_text">消した枚数: {{ erased }}枚</span>
    </div>
    <div class="score_block">
      <span class="score_text">スコア: {{ score }}点</span>
      <transition name="bonus">
        <div v-if="bonus !== 0" class="bonus_text">
          <span>同時消しボーナス +{{ bonus }}点</span>
        </div>
      </transition>
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
            height: ${size.value / 1.5}px`"
        >
          {{ state.array[i][j] }}
        </div>
      </div>
      <br />
    </div>
  </div>
</template>

<style scoped>
.outer {
  border: 3px solid burlywood;
  width: 90svw;
}

.number_card {
  display: flex;
  justify-content: center;
  border-radius: 10%;
  background: whitesmoke;
  top: 50%;
  box-shadow: 0.5svw 0.5svw 1svw 0svw rgba(0, 0, 0, 0.3);
  font-size: 1.5rem;
}

.text_block {
  display: flex;
}

.erase_block {
  margin: 1svw;
  width: 30svw;
  height: 3.5rem;
  border: 1svw dashed skyblue;
  line-height: 3.5rem;
}

.score_block {
  display: flex;
  margin: 1svw;
  width: 50svw;
  height: 3.5rem;
  border: 1svw dashed skyblue;
  line-height: 3.5rem;
  justify-content: flex-start;
}

.score_text {
  margin: auto 1svw;
}

.bonus_text {
  margin: auto 1svw;
  color: goldenrod;
}

/* 表示時の状態 */
.bonus-enter-from {
  opacity: 0;
}
/* 表示時のアクティブ状態 */
.bonus-enter-active {
  transition: all 1s;
}
/* 表示時の終了状態 */
.bonus-enter-to {
  opacity: 1;
}
/* 非表示時の状態 */
.bonus-leave-from {
  opacity: 1;
}
/* 非表示時のアクティブ状態 */
.bonus-leave-active {
  transition: all .5s;
}
/* 非表示時の終了状態 */
.bonus-leave-to {
  opacity: 0;
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
