import Zdog from 'zdog'
import Zfont from 'zfont'
import * as Tone from 'tone'
import * as Vibrant from 'node-vibrant'

import { clearSequence, sequencer, setRandomSequence } from './src/sequencer'
import { getBlockText } from './src/font'
import { getPhrases } from './src/words'

import './style.css'

Zfont.init(Zdog)

const numberOfImages = 78
const imageNumber = `${Math.floor(Math.random() * numberOfImages + 1)}`.padStart(3, '0')
const bgImage = `./i/${imageNumber}.jpg`
const gridSize = 12
const yOffset = 0
const [preLine, mainLine] = getPhrases()
const blockText = getBlockText(mainLine)
const fallbackColor = {
  color: '#c25',
  leftFace: '#ea0',
  rightFace: '#e62',
  topFace: '#ed0',
  bottomFace: '#636',
}

setRandomSequence()

Vibrant.from(bgImage).getPalette()
  .then((palette) => {
    document.querySelector('#scroller').style = `background-image: url(${bgImage})`

    let ticker = 0
    let cycleCount = 240
    let interval = 1800
    let firstRun = true

    const animate = () => {
      let progress = ticker / cycleCount
      let tween = Zdog.easeInOut(progress % 1, 2)

      ticker++

      if (ticker < cycleCount && ticker < interval) {
        if (firstRun) {
          illo.zoom = Math.sin(illo.rotate.x / 4)
        }
        illo.rotate.x = tween * Zdog.TAU
      } else if (ticker > cycleCount && ticker < interval) {
        // Hide?
      } else if (ticker > interval) {
        firstRun = false
        ticker = 0
      }

      illo.rotate.z = Math.sin(new Date().getTime() / 2400) * .04
      illo.updateRenderGraph()

      requestAnimationFrame(animate)
    }

    const illo = new Zdog.Illustration({
      element: '.illo',
      dragRotate: false,
      centered: true,
      rotate: {
        y: -0.28,
      },
    })

    const zFont = new Zdog.Font({
      src: './spitlo_f1.ttf'
    })

    const text = new Zdog.TextGroup({
      addTo: illo,
      font: zFont,
      value: preLine.toUpperCase(),
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

    let playing = false
    let started = false
    let loop
    const $play = document.getElementById('play')
    $play.addEventListener('click', async (e) => {
      e.preventDefault()
      if (!started) {
        if (!loop) {
          loop = sequencer()
        }
        Tone.start()
        Tone.Transport.bpm.value = 56
        Tone.Transport.scheduleRepeat(loop, '16n')
        started = true
      }

      if (playing) {
        Tone.Transport.stop()
        playing = false
        $play.textContent = 'Play'
      } else {
        await Tone.Transport.start()
        playing = true
        $play.textContent = 'Stop'
      }
    })

    const $clear = document.getElementById('clear')
    $clear.addEventListener('click', () => {
      clearSequence()
    })

    const $randomize = document.getElementById('randomize')
    $randomize.addEventListener('click', () => {
      clearSequence()
      setRandomSequence()
    })
  })
