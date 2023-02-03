function debug(debugText) {
  if (import.meta.env.DEV) {
    console.info(debugText)
  }
}

function getArrayElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomBoolean(probability = 0.5) {
  return Math.random() > 1 - probability
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

const version = __APP_VERSION__

export {
  debug,
  getArrayElement,
  getRandomBoolean,
  getRandomInt,
  version,
}
