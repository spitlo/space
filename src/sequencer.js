import * as Tone from 'tone'

const samples = new Tone.Buffers({
  0: './s/kick.wav',
  1: './s/snare.wav',
  2: './s/clap.wav',
  3: './s/hat.wav',
  4: './s/cymb.wav',
  5: './s/tom.wav',
  6: './s/fx1.wav',
  7: './s/fx2.wav',
  8: './s/synth-C2.wav',
  9: './s/synth-C3.wav',
}, () => {
  console.log('Samples loaded')
})
const sounds = []

const sequencer = () => {
  let index = 0

  for (let sample = 0; sample < 10; sample++) {
    sounds.push(new Tone.Player(samples.get(sample)).toDestination())
  }

  const loop = (time) => {
    let step = index % 16


    for (let row = 0; row < 10; row++) {
      const current = document.querySelector(`.row${row} input:nth-child(${step + 1})`)

      if (current && current.checked) {
        sounds[row].start()
      }

      Tone.Draw.schedule(() => {
        const prev = step === 0
          ? document.querySelector(`.row${row} input:nth-child(16)`)
          : document.querySelector(`.row${row} input:nth-child(${step})`)

        if (prev) {
          prev.classList.remove('active')
        }

        if (current) {
          current.classList.add('active')
        }
      }, time)
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
    let probability = row > 4 ? 0.10 : 0.15
    if (row === 3) {
      probability = 0.5
    }
    if (step === 0 || step === 4 || step === 8 || step === 12) {
      probability = 0.35
    } else if (step % 2 === 0) {
      probability = 0.20
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
