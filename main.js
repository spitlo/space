import Zdog from 'zdog'
import Zfont from 'zfont'
import * as Tone from 'tone'
import * as Vibrant from 'node-vibrant'

import { addClickEvents, clearSequence, init, setRandomSequence, getSequence, setSequence, sequencer } from './src/sequencer'
import { getBlockText } from './src/font'
import { getPhrases } from './src/words'
import { getRandomInt,  version } from './src/utils'
import { load, save, stash, storage } from './src/storage'
import { terminal, termRunner } from './src/term'

import './style.css'

Zfont.init(Zdog)

load()
init()

const numberOfImages = 78
const imageNumber = storage.imageNumber || `${getRandomInt(1, numberOfImages)}`.padStart(3, '0')
const bgImage = `./i/${imageNumber}.jpg`
const gridSize = 12
const yOffset = -24
const [bandName, songName] = storage.phrases || getPhrases()
const blockText = getBlockText(songName)
const fallbackColors = {
  color: '#c25',
  leftFace: '#ea0',
  rightFace: '#e62',
  topFace: '#ed0',
  bottomFace: '#636',
}

stash({ imageNumber, phrases: [ bandName, songName ] })

setInterval(termRunner, 100)

Vibrant.from(bgImage).getPalette()
  .then((palette) => {
    document.querySelector('#scroller').style = `background-image: url(${bgImage})`
    document.querySelector('#version').innerText = `v${version}`

    let ticker = 0
    let cycleCount = 240
    let interval = 1800
    let firstRun = true

    terminal('Color scheme loaded.')
    terminal(`Palette:
  Muted: ${palette.Muted.getHex()}
  Vibrant: ${palette.Vibrant.getHex()}
  LightMuted: ${palette.LightMuted.getHex()}
  LightVibrant: ${palette.LightVibrant.getHex()}
  DarkVibrant: ${palette.DarkVibrant.getHex()}
`)

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
      src: './spitlo_f1-v1.1.ttf'
    })

    const text = new Zdog.TextGroup({
      addTo: illo,
      font: zFont,
      value: bandName.toUpperCase(),
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
    if (storage.sequence) {
      setSequence(storage.sequence)
    } else {
      setRandomSequence()
    }
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

    terminal('Initiating animation...')
    animate()

    // Set up buttons
    let initiated = false
    addClickEvents(() => {
      // We need to use the click events on the sequence dots to start sound,
      // since browsers don’t allow playing sound without interaction.
      init(true) // Silent init
      sequencer(true) // Only load samples
      if (!initiated) {
        Tone.start()
        initiated = true
      }
    })

    let playing = false
    let started = false
    const $play = document.getElementById('play')
    $play.addEventListener('click', async (e) => {
      e.preventDefault()
      $play.classList.remove('unpressed')
      if (!initiated) {
        Tone.start()
        initiated = true
      }
      if (!started) {
        const  [loop, bpm] = sequencer()
        Tone.Transport.bpm.value = bpm
        Tone.Transport.scheduleRepeat(loop, '16n')
        started = true
      }

      if (playing) {
        Tone.Transport.stop()
        playing = false
        $play.textContent = 'Play'
        terminal('Stopping')
      } else {
        await Tone.Transport.start()
        playing = true
        $play.textContent = 'Stop'
        terminal('Playing')
      }
    })

    const $clear = document.getElementById('clear')
    $clear.addEventListener('click', () => {
      clearSequence()
      terminal('Clearing sequence')
    })

    const $randomize = document.getElementById('randomize')
    $randomize.addEventListener('click', () => {
      clearSequence()
      setRandomSequence()
      terminal('Randomizing sequence')
    })

    const $autoevolve = document.getElementById('autoevolve')
    if (storage.autoevolve === 'off') {
      $autoevolve.checked = false
    }
    $autoevolve.addEventListener('change', () => {
      const checked = $autoevolve.checked
      terminal(`Auto-evolve is: ${checked ? 'On' : 'Off'}`)
      stash({
        autoevolve: checked ? 'on' : 'off',
      })
    })

    const $next = document.getElementById('next')
    $next.addEventListener('click', () => {
      location.href = '.'
    })

    const $save = document.getElementById('save')
    $save.addEventListener('click', () => {
      const sequence = getSequence()
      stash({
        bandName,
        songName,
        sequence,
      })
      save()
      terminal(`
This song is now saved. To share it, copy the URL from the address bar.
      `)
    })

    const $help = document.getElementById('help')
    $help.addEventListener('click', () => {
      terminal(`
Help
====
If you want to create your own sequence, simply clear the playing sequence,
disable auto-evolve and create your own sequence by clicking the corresponding dots.
You cannot change the BPM, the samples or the effects, you can only change the
sequence. Channel 10 is special, everytime a note is struck on it, it either plays
the sample for that track, or a short note. If play mode is set to "continuous",
it will always play a note, the next note from the current scale note collection.

If you’re not happy with the current preset, just click "Next" until you find
something that you like.

If you want to check out the code for this, visit github.com/spitlo/space
      `)
    })
  })
