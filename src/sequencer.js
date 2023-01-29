import * as Tone from 'tone'

// Put all samples in buffers so they are ready to go when we start
const kitNumber = `${Math.floor(Math.random() * 3 + 1)}`.padStart(3, '0')
const samples = new Tone.Buffers({
  0: `./s/${kitNumber}/kick.wav`,
  1: `./s/${kitNumber}/snare.wav`,
  2: `./s/${kitNumber}/hat.wav`,
  3: `./s/${kitNumber}/cymb.wav`,
  4: `./s/${kitNumber}/fx1.wav`,
  5: `./s/${kitNumber}/fx2.wav`,
  6: `./s/${kitNumber}/fx3.wav`,
  7: `./s/${kitNumber}/fx4.wav`,
  8: `./s/${kitNumber}/synth-C2.wav`,
  9: `./s/${kitNumber}/synth-C3.wav`,
}, () => {
  // Samples are loaded, enable play button
  const $play = document.getElementById('play')
  $play.disabled = false
  $play.textContent = 'Play'
})
const sounds = []

const sequencer = () => {
  let index = 0

  const filter = new Tone.AutoFilter(4).start()
  const reverb = new Tone.JCReverb(0.4)
  const volume = new Tone.Volume(-12)
  const delay = new Tone.PingPongDelay('8n', 0.2)

  for (let sample = 0; sample < 10; sample++) {
    const player = new Tone.Player(samples.get(sample))
    player.chain(reverb, filter, delay, volume, Tone.Destination)
    sounds.push(player)
  }

  const loop = (time) => {
    let step = index % 16

    const autoevolve = document.getElementById('autoevolve').checked

    for (let row = 0; row < 10; row++) {
      const current = document.querySelector(`.row${row} input:nth-child(${step + 1})`)

      if (current && current.checked) {
        sounds[row].start()
      }

      Tone.Draw.schedule(() => {
        // Put all DOM stuff we can in a scheduler to enable smooth playing
        const prev = step === 0
          ? document.querySelector(`.row${row} input:nth-child(16)`)
          : document.querySelector(`.row${row} input:nth-child(${step})`)

        if (prev) {
          prev.classList.remove('playing')
        }

        if (current) {
          current.classList.add('playing')

          if (autoevolve) {
            // If mode is set to autoevolve, we want to set or unset a step with some randomness
            const evolveProbability = Math.random()
            if (current.checked && evolveProbability > 0.65) {
              current.checked = false
            } else if (!current.checked && evolveProbability > 0.85) {
              current.checked = true
            }
          }
        }
      }, time)
    }

    index++
  }

  return loop
}

// Utility function do run a function once per checkbox
const doForAll = (task) => {
  for (let row = 0; row < 10; row++) {
    for (let step = 0; step < 16; step++) {
      task(row, step)
    }
  }
}

// Function to generate a sequence based on some logic and some randomness
const setRandomSequence = () => {
  const setRandom = (row, step) => {
    const rnd = Math.random()
    // First four rows are basic drums, make them a wee bit more probable
    let probability = row > 4 ? 0.08 : 0.10
    // Increase the probability for some four on the floor sweetness and general
    // germaninity by accentuating even steps
    if (step === 0 || step === 4 || step === 8 || step === 12) {
      probability = 0.25
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

// Function to remove all programming
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
