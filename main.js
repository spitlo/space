import Zdog from 'zdog'
import Zfont from 'zfont'

import alphabet from './src/alphabet'

import './style.css'

Zfont.init(Zdog)

const setBgImage = () => {
  const imageNumber = `${Math.floor(Math.random() * 56 + 1)}`.padStart(3, '0')
  document.querySelector('#container').style = `background-image: url(/${imageNumber}.jpg)`
}

setBgImage()

const gridSize = 16
const yOffset = 0

// create illo
let illo = new Zdog.Illustration({
  // set canvas with selector
  element: '.illo',
  dragRotate: true,
  centered: true,
  rotate: {
    x: 0.18,
    y: -0.14,
    z: -0.08,
  },
})

let font = new Zdog.Font({
  src: '/spitlo_f1.ttf'
})

const text = new Zdog.TextGroup({
  addTo: illo,
  font: font,
  value: 'WELCOME TO',
  fontSize: 48,
  color: '#fff',
  stroke: 2,
  fill: true,
  translate: {
    x: -512,
    y: yOffset - gridSize,
  }
})

const blockText = [
  'xxxx xxxx xxx xxxxx x    xxxx     xxxx xxxx x   x',
  'x    x  x  x    x   x    x  x     x  x x  x xx xx' ,
  'xxxx xxxx  x    x   x    x  x     x    x  x x x x',
  '   x x     x    x   x    x  x     x  x x  x x   x',
  'xxxx x    xxx   x   xxxx xxxx  x  xxxx xxxx x   x',
]

let paintStarted = false
let block
for (let row = 0; row < blockText.length; row++) {
  for (let col = 0; col < blockText[row].split('').length; col++) {
    if (blockText[row].split('')[col] === 'x') {
      if (paintStarted) {
        block.copy({
          translate: {
            x: (col * gridSize) - 512,
            y: row * gridSize + yOffset,
          }
        })
      } else {
        paintStarted = true
        block = new Zdog.Box({
          addTo: illo,
          color: '#c25',
          leftFace: '#ea0',
          rightFace: '#e62',
          topFace: '#ed0',
          bottomFace: '#636',
          width: gridSize,
          height: gridSize,
          depth: gridSize,
          translate: {
            x: col * gridSize - 512,
            y: row * gridSize + yOffset,
          }
        })
      }
    }
  }
}

let ticker = 0
let cycleCount = 300

// Animation loop
function animate() {
  // illo.rotate.x += Math.cos(new Date().getTime() / 2300000000000000000000)
  // illo.rotate.x += 0.01;
  // illo.zoom = Math.sin(illo.rotate.x / 180)
  // textShadow.translate.y += Math.sin(new Date().getTime() / 230000000)
  let progress = ticker / cycleCount;
  // apply easing to rotation
  let tween = Zdog.easeInOut( progress % 1, 3 )
  illo.rotate.x = tween * Zdog.TAU
  ticker++

  illo.updateRenderGraph()
  requestAnimationFrame(animate)
}

animate()
