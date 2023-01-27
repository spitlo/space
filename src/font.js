const alphabet = {
  a: [
    '  xx',
    ' x x',
    'x  x',
    'xxxx',
    'x  x',
  ],
  b: [
    'xxx ',
    'x  x',
    'xxx ',
    'x  x',
    'xxxx',
  ],
  c: [
    ' xxx',
    'x  x',
    'x   ',
    'x  x',
    'xxxx',
  ],
  d: [
    'xxx ',
    'x  x',
    'x  x',
    'x  x',
    'xxx ',
  ],
  e: [
    'xxx ',
    'x   ',
    'xx  ',
    'x  x',
    'xxxx',
  ],
  f: [
    'xxxx',
    'x  x',
    'xx  ',
    'x   ',
    'x   ',
  ],
  g: [
    ' xxx',
    'x   ',
    'x xx',
    'x  x',
    'xxxx',
  ],
  h: [
    '   x',
    'x  x',
    'xxxx',
    'x  x',
    'x  x',
  ],
  i: [
    'xxx',
    ' x ',
    ' x ',
    ' x ',
    'xxx',
  ],
  j: [
    'xxxx',
    '   x',
    '   x',
    'x  x',
    ' xx ',
  ],
  k: [
    'x  x',
    'x  x',
    'xxx ',
    'x  x',
    'x  x',
  ],
  l: [
    'x   ',
    'x   ',
    'x   ',
    'x   ',
    'xxxx',
  ],
  m: [
    'x   x',
    'xx xx',
    'x x x',
    'x   x',
    'x   x',
  ],
  n: [
    'x  x',
    'xx x',
    'x xx',
    'x  x',
    'x  x',
  ],
  o: [
    ' xxx',
    'x  x',
    'x  x',
    'x  x',
    'xxxx',
  ],
  p: [
    'xxxx',
    '   x',
    'xxxx',
    'x   ',
    'x   ',
  ],
  q: [
    ' xxx',
    'x  x',
    'x  x',
    'x xx',
    'xxxx',
  ],
  r: [
    'xxxx',
    'x  x',
    'xxx ',
    'x  x',
    'x  x',
  ],
  s: [
    'xxxx',
    'x   ',
    'xxxx',
    '   x',
    'xxxx',
  ],
  t: [
    'xxx',
    ' x ',
    ' x ',
    ' x ',
    ' x ',
  ],
  u: [
    'x  x',
    'x  x',
    'x  x',
    'x  x',
    'xxxx',
  ],
  v: [
    'x  x',
    'x  x',
    'x  x',
    'x  x',
    ' xx ',
  ],
  w: [
    'x   x',
    'x   x',
    'x x x',
    'xx xx',
    'x   x',
  ],
  x: [
    'x  x',
    'x  x',
    ' xx ',
    'x  x',
    'x  x',
  ],
  y: [
    'x   x',
    'x   x',
    ' x x ',
    '  x  ',
    '  x  ',
  ],
  z: [
    'xxxx',
    '   x',
    ' xx ',
    'x   ',
    'xxxx',
  ],
  '.': [
    '   ',
    '   ',
    '   ',
    '   ',
    ' x ',
    ],
  '/': [
    '    x',
    '   x ',
    '  x  ',
    ' x   ',
    'x    ',
  ],
  '-': [
  '  ',
  '  ',
  'xx',
  '  ',
  '  ',
  ],
  '(': [
  ' x',
  'x ',
  'x ',
  'x ',
  ' x',
  ],
  ')': [
  'x ',
  ' x',
  ' x',
  ' x',
  'x ',
  ],
  ' ': [
  '  ',
  '  ',
  '  ',
  '  ',
  '  ',
  ],
}

const getBlockText = (text) => {
  const textArray = text.toLowerCase().split('')
  const textBlock = [[],[],[],[],[]]
  for (let t = 0; t < textArray.length; t++) {
    if (alphabet[textArray[t]]) {
      const character = alphabet[textArray[t]]
      for (let row = 0; row < character.length; row++) {
        const cols = character[row].split('')
        for (let col = 0; col < cols.length; col++) {
          textBlock[row].push(character[row][col] === 'x')
        }
      }
      // Add spacing
      for (let row = 0; row < character.length; row++) {
        const cols = character[row].split('')
        for (let col = 0; col < 1; col++) {
          textBlock[row].push(false)
        }
      }
    } else {
      console.warn(`Missing character "${textArray[t]}"`)
    }
  }

  return textBlock
}

export  { alphabet, getBlockText }
