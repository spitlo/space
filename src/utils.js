function getArrayElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomBoolean(probability) {
  return Math.random() > 1 - probability
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

export {
  getArrayElement,
  getRandomBoolean,
  getRandomInt,
}
