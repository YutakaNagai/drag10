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
  }

  document.onmousemove = null
}

let left = 0
let top = 0
document.onmousedown = dragStart
document.onmouseup = dragEnd

const array = []

for(let i = 0; i < areaLength.value; i++){
  array[i] = []
  for(let j = 0; j < areaLength.value; j++){
    array[i][j] = Math.floor((Math.random(10) * 8) + 1)
  }
}

const state = reactive({
  array,
})

const size = ref(0)
const outerRef = ref(null)
onMounted(() => {
  const outerDom = outerRef.value
  const outerRect = outerDom.getBoundingClientRect()

  size.value = ref(outerRect.width / (areaLength.value + 1))
})

</script>

<template>
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
  border: 1px solid black;
  /* display: inline-block; */
  display: flex;
  justify-content: center;
  /* position: absolute; */
  top: 50%;
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
