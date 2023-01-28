import * as Tone from 'tone'

const samples = [
  './s/kick.wav',
  './s/snare.wav',
  './s/clap.wav',
  './s/hat.wav',
  './s/cymb.wav',
  './s/tom.wav',
  './s/fx1.wav',
  './s/fx2.wav',
  './s/synth-C2.wav',
  './s/synth-C3.wav',
]
const sounds = []
for (const sample of samples) {
  sounds.push(new Tone.Player(sample).toDestination())
}

const sequencer = () => {
  let index = 0

  const loop = () => {
    let step = index % 16

    for (let row = 0; row < 10; row++) {
      const prev = step === 0
        ? document.querySelector(`.row${row} input:nth-child(16)`)
        : document.querySelector(`.row${row} input:nth-child(${step})`)
      const current = document.querySelector(`.row${row} input:nth-child(${step + 1})`)

      if (prev) {
        prev.classList.remove('active')
      }

      if (current) {
        current.classList.add('active')
      }

      if (current && current.checked) {
        sounds[row].start('1n')
      }
    }

    index++
  }

  return loop
}

const doForAll = (task) => {
  for (let row = 0; row < 10; row++) {
    for (let step = 0; step < 16; step++) {
      task(row, step)
    }
  }
}

const setRandomSequence = () => {
  const setRandom = (row, step) => {
    const rnd = Math.random()
    let probability = 0.25
    if (step === 0 || step === 4 || step === 8 || step === 12) {
      probability = 0.45
    } else if (step % 2 === 0) {
      probability = 0.30
    }
    if (probability > rnd) {
      const current = document.querySelector(`.row${row} input:nth-child(${step + 1})`)
      current.checked = true
    }
  }
  doForAll(setRandom)
}

const clearSequence = () => {
  const clear = (row, step) => {
    const current = document.querySelector(`.row${row} input:nth-child(${step + 1})`)
    if (current) {
      current.checked = false
    }
  }
  doForAll(clear)
}

export { clearSequence, sequencer, setRandomSequence }
