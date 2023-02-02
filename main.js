import Zdog from 'zdog'
import Zfont from 'zfont'
import * as Tone from 'tone'
import * as Vibrant from 'node-vibrant'

import { clearSequence, sequencer, setRandomSequence } from './src/sequencer'
import { getBlockText } from './src/font'
import { getPhrases } from './src/words'
import { getRandomInt } from './src/utils'

import './style.css'

Zfont.init(Zdog)

const numberOfImages = 78
const imageNumber = `${getRandomInt(1, numberOfImages)}`.padStart(3, '0')
const bgImage = `./i/${imageNumber}.jpg`
const gridSize = 12
const yOffset = -24
const [preLine, mainLine] = getPhrases()
const blockText = getBlockText(mainLine)
const fallbackColors = {
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

    // Show sequencer and set colors based on background image
    setRandomSequence()
    const root = document.documentElement
    root.style.setProperty('--seqTrack', palette.Vibrant.getHex())
    root.style.setProperty('--seqActive', palette.LightMuted.getHex())
    root.style.setProperty('--seqPlaying', palette.LightVibrant.getHex())
    const $sequencer = document.getElementById('sequencer')
    $sequencer.classList.add('loaded')
    const $controls = document.getElementById('controls')
    $controls.classList.add('loaded')

    // Add "band" and "song" name
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
              ...fallbackColors,
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

    // Set up buttons
    let playing = false
    let started = false
    let loop
    const $play = document.getElementById('play')
    $play.addEventListener('click', async (e) => {
      e.preventDefault()
      $play.classList.remove('unpressed')
      if (!started) {
        if (!loop) {
          loop = sequencer()
        }
        Tone.start()
        Tone.Transport.bpm.value = 24
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

    const $next = document.getElementById('next')
    $next.addEventListener('click', () => {
      location.reload()
    })
  })
