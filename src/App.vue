<script setup>
import HelloWorld from './components/HelloWorld.vue'

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

  const cards = document.getElementsByClassName("card")
  for(let i = 0; i < cards.length; i++){
    // 各カードの矩形範囲を取得
    const card = cards[i]
    const cardRect = card.getBoundingClientRect()

    // ドラッグの矩形内にカードが含まれているか判定
    if(cardRect.left > rect.left
      && cardRect.left + cardRect.width < rect.left + rect.width
      && cardRect.top > rect.top
      && cardRect.top + cardRect.height < rect.top + rect.height){
        console.log('card', i, ' is include :>> ');
        card.style.backgroundColor = "lightblue"
      }
  }

  document.onmousemove = null
}

let left = 0
let top = 0
document.onmousedown = dragStart
document.onmouseup = dragEnd
</script>

<template>
  <div class="outer">
    <div id="rect"></div>
    <div class="card">1</div>
    <div class="card">2</div>
    <div class="card">3</div>
  </div>
</template>

<style scoped>
.outer {
  border: 3px solid burlywood;
}

.card {
  border: 1px solid black;

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
