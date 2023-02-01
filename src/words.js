// Name generator based on https://github.com/tirdadc/synthwave
const words = [
  'Action',
  'Arcade',
  'Arnold',
  'Attack',
  'Blast',
  'Blaster',
  'Bronson',
  'Cassette',
  'Club',
  'Cobra',
  'Cruise',
  'Cyborg',
  'Danger',
  'Dreams',
  'Drive',
  'Electric',
  'Elite',
  'Ferrari',
  'Fist',
  'Flash',
  'FM',
  'Force',
  'Future',
  'Glove',
  'Hi-Fi',
  'Highway',
  'Hotline',
  'Jackson',
  'Kennedy',
  'Laser',
  'Lights',
  'Maximum',
  'Mega',
  'Midnite',
  'Neon',
  'Night',
  'Noir',
  'Power',
  'Radar',
  'Rage',
  'Samantha',
  'Showdown',
  'Skyfall',
  'Skyline',
  'Squad',
  'Stallone',
  'Star',
  'Stereo',
  'Street',
  'Strike',
  'Sunset',
  'Tango',
  'Tesla',
  'Turbo',
  'United',
  'Urban',
  'Vector',
  'VHS',
  'Vice',
  'Video',
  'Wave',
  'XXX',
  'Youth',
  'Zulu',
]

const numbers = [
  '1984',
  '2000',
  '\'84',
  '\'86',
  'IV',
  'One',
]

const prefixLocations = [
  'Amsterdam',
  'Bangalore',
  'Borneo',
  'Broadway'
  'Calif.',
  'Dresden',
  'Hong Kong',
  'Interstate',
  'LA',
  'Malibu',
  'Miami',
  'Paris',
  'Tokyo',
]

const suffixLocations = [
  'Djungle'
  'Street',
  'Trenches',
  'Valley',
]

const suffixes = [
  'case',
  'cop',
  'copter',
  'crawler',
  'cruise',
  'drive',
  'driver',
  'dynamix',
  'fighter',
  'game',
  'hawk',
  'hunter',
  'land',
  'loader',
  'lord',
  'mancer',
  'maxx',
  'net',
  'nights',
  'noir',
  'rider',
  'shaper',
  'slasher',
  'starr',
  'tech',
  'tron',
  'tronix',
  'worx',
]

const prefixes = [
  'Aero',
  'Beta',
  'Bronto',
  'Chrono',
  'Echo',
  'Edge',
  'Electro',
  'Fusion',
  'Futur',
  'Glitch',
  'Head',
  'Inter',
  'Lazer',
  'Mega',
  'Multi',
  'Neon',
  'Neuro',
  'Night',
  'Poly',
  'Radio',
  'Stereo',
  'Strange',
  'Synth',
  'Tech',
  'Thunder',
  'Time',
]

function generateComposedWord(prefixes, suffixes) {
  return getRandomItem(prefixes, []) + getRandomItem(suffixes, [])
}

function getRandomItem(list, excludeItems) {
  const newItem = list[Math.floor((Math.random() * list.length))]
  if (excludeItems.length && excludeItems.includes(newItem)) {
    return getRandomItem(list, excludeItems)
  }
  return newItem
}

function randomBoolean(probability) {
  return Math.random() > 1 - probability
}

function addIfNotPresent(list, word) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].includes(word) && word.includes(list[i])) {
      return
    }
  }
  list.push(word)
}

function generateName(maxWords) {
  const name = []
  const addPrefixLocation = randomBoolean(0.2)
  const addNumber = randomBoolean(0.1)
  const addSuffixLocation = randomBoolean(0.05)
  const numberOfWords = maxWords || 2

  if (randomBoolean(0.2)) {
    addIfNotPresent(name, generateComposedWord(prefixes, suffixes))
    return name.join('')
  }

  for (let i = 0; i < numberOfWords; i++) {
    addIfNotPresent(name, getRandomItem(words, name))
  }

  if (addPrefixLocation) {
    name.unshift(getRandomItem(prefixLocations, name))
  }

  if (!addPrefixLocation && addSuffixLocation) {
    addIfNotPresent(name, getRandomItem(suffixLocations, name))
  }

  if (addNumber) {
    addIfNotPresent(name, getRandomItem(numbers, name))
  }

  // Shorten name if needed
  if (maxWords) {
    name.length = maxWords
  }

  return name.join(' ')
}

const getPhrases = () => {
  return [generateName(), generateName(2)]
}

export {
  getPhrases,
}
