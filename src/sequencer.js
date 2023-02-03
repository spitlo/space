import * as Tone from 'tone'

import { debug, getArrayElement, getRandomBoolean, getRandomInt } from './utils'

// Put all samples in buffers so they are ready to go when we start
const numberOfKits = 6
const kitNumber = `${getRandomInt(1, numberOfKits)}`.padStart(3, '0')
const createKit = (kitNumber) => {
  const kit = {}
  for (let n = 0; n < 10; n++) {
    kit[n] = `./s/${kitNumber}/${n}.wav`
  }
  return kit
}
const sounds = []
const samples = new Tone.Buffers(createKit(kitNumber), () => {
  // Samples are loaded, enable play button
  debug(`Loaded kit successfully!`)
  const $play = document.getElementById('play')
  $play.disabled = false
  $play.textContent = 'Play'
})

// Now create a synth for channel 10.
const oscillatorTypes = [
  'sine', 'square', 'triangle', 'sawtooth',
]
const synth = new Tone.Synth({
  volume: -6,
})
const synthType = getRandomBoolean() ? 'pulse' : getArrayElement(oscillatorTypes)
synth.oscillator.type = synthType
const filterType = getArrayElement(oscillatorTypes)

// Pick a note collection for this iteration.
// We have to ways to play a note collection. Either pick a note at random, or
// play each note in succession, returning back to the start once all notes
// are played. A note collection "made for" laying a melody will "lean" towards
// specific notes since reappearing notes will be more likely to be picked.
// Let’s view this as a feature, not a bug.
const synthMode = getRandomBoolean() ? 'continuous' : 'random'
const noteCollections = [
  ['A#', 'B#', 'D', 'D#', 'E#', 'G', 'G#'], // Mixolydian scale
  ['A', 'F#', 'C', 'D#'], // ?
  ['B', 'D', 'E', 'F#', 'A'], // Minor pentatonic scale
  ['E', 'F♯', 'G♯', 'A', 'B', 'C', 'D'], // Aeolian Dominant scale
  ['A', 'F', 'F#', 'G'], // ?
]
const noteCollection = getArrayElement(noteCollections)
const durations = [
  '8n', '8t',
  '16n', '16t',
  '32n', '32n', '32t',
  '64n', '64n', '64t', '64t',
]
const bpm = getRandomInt(18, 52)

debug(`
Debug info
==========
BPM: ${bpm}
Kit: ${kitNumber}
Filter type: ${filterType}
Synth type: ${synthType}
Synth mode: ${synthMode}
Note collection: ${noteCollection}
`)

// This is the main exorted function. It sets up all effects, creates players
// for all samples, and finally sets up the main sequencer loop
const sequencer = () => {
  let index = 0

  const filter = new Tone.AutoFilter(getRandomInt(2, 5)).start()
  filter.type = filterType
  const reverb = new Tone.JCReverb(Math.random())
  const volume = new Tone.Volume(-12)
  const delay = new Tone.PingPongDelay(getArrayElement(durations), 0.2)

  // Loop through all the samples in the buffer and assign them to a player
  for (let sample = 0; sample < 10; sample++) {
    const player = new Tone.Player(samples.get(sample))
    player.chain(reverb, filter, delay, volume, Tone.Destination)
    synth.chain(reverb, filter, delay, Tone.Destination)
    sounds.push(player)
  }

  const loop = (time) => {
    let step = index % 16

    const autoevolve = document.getElementById('autoevolve').checked

    for (let row = 0; row < 10; row++) {
      const current = document.querySelector(`.row${row} input:nth-child(${step + 1})`)

      if (current && current.checked) {
        // For the last row, play notes sometimes and sample sometimes. If we’re
        // in continuous synth mode, we always play the note, hoping to perhaps
        // hear a faint melody.
        if (row === 9 && (synthMode === 'continuous' || getRandomBoolean(0.8))) {
          let nextNote
          if (synthMode === 'continuous') {
            // Get next note in note collection
            nextNote = noteCollection.shift()
            // And push it back at the end
            noteCollection.push(nextNote)
          } else {
            nextNote = getArrayElement(noteCollection)
          }
          const octave = getRandomInt(2, 7)
          const duration = getArrayElement(durations)
          const now = Tone.now()
          synth.triggerAttackRelease(nextNote + octave, duration,  now)
        } else {
          sounds[row].start()
        }
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
            if (current.checked && getRandomBoolean(0.35)) {
              current.checked = false
            } else if (!current.checked && getRandomBoolean(0.15)) {
              current.checked = true
            }
          }
        }
      }, time)
    }

    index++
  }

  return [loop, bpm]
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
    // First four rows are basic drums, make them a wee bit more probable
    let probability = row > 4 ? 0.08 : 0.10
    // Increase the probability for some four on the floor sweetness and general
    // germaninity by accentuating even steps
    if (step === 0 || step === 4 || step === 8 || step === 12) {
      probability = 0.30
    } else if (step % 2 === 0) {
      probability = 0.20
    }
    if (getRandomBoolean(probability)) {
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
