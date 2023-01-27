import Zdog from 'zdog'
import Zfont from 'zfont'
import * as Vibrant from 'node-vibrant'

import { getBlockText } from './src/font'

import './style.css'

Zfont.init(Zdog)

const imageNumber = `${Math.floor(Math.random() * 56 + 1)}`.padStart(3, '0')
const bgImage = `/${imageNumber}.jpg`
const gridSize = 12
const yOffset = 0
const blockText = getBlockText('outer space')
const fallbackColor = {
  color: '#c25',
  leftFace: '#ea0',
  rightFace: '#e62',
  topFace: '#ed0',
  bottomFace: '#636',
}

Vibrant.from(bgImage).getPalette()
  .then((palette) => {
    document.querySelector('#scroller').style = `background-image: url(${bgImage})`

    let ticker = 0
    let cycleCount = 300

    const animate = () => {
      let progress = ticker / cycleCount;
      let tween = Zdog.easeInOut( progress % 1, 3 )
      illo.rotate.x = tween * Zdog.TAU
      ticker++

      illo.updateRenderGraph()
      requestAnimationFrame(animate)
    }

    let illo = new Zdog.Illustration({
      element: '.illo',
      dragRotate: true,
      centered: true,
      rotate: {
        y: -0.28,
        z: -0.02,
      },
    })

    let zFont = new Zdog.Font({
      src: '/spitlo_f1.ttf'
    })

    const text = new Zdog.TextGroup({
      addTo: illo,
      font: zFont,
      value: 'WELCOME TO',
      fontSize: 32,
      color: '#ffe',
      stroke: 2,
      fill: true,
      translate: {
        x: -512,
        y: yOffset - gridSize,
      }
    })


    let paintStarted = false
    let block
    for (let row = 0; row < blockText.length; row++) {
      for (let col = 0; col < blockText[row].length; col++) {
        if (blockText[row][col]) {
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
              ...fallbackColor,
              color: palette.Muted.getHex(),
              leftFace: palette.Vibrant.getHex(),
              rightFace: palette.LightMuted.getHex(),
              topFace: palette.LightVibrant.getHex(),
              bottomFace: palette.DarkVibrant.getHex(),
              width: gridSize,
              height: gridSize,
              depth: gridSize,
              stroke: 1,
              translate: {
                x: col * gridSize - 512,
                y: row * gridSize + yOffset,
              }
            })
          }
        }
      }
    }

    animate()

  })
