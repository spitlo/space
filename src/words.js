const phrases = [
 ['welcome to', 'outer space'],
 // ['', ''],
 // ['', ''],
 // ['', ''],
 // ['', ''],
 // ['', ''],
]

const getPhrases = () => {
  return phrases[Math.floor(Math.random() * phrases.length)]
}

export {
  getPhrases,
}
