let queue = []
const $terminal = document.querySelector('#terminal')

const terminal = (terminalText) => {
  if (terminalText) {
    queue = queue.concat(terminalText.split('\n'))
    queue.push('\n')
  }
}

const termRunner = () => {
  if (queue.length) {
    const line = queue.shift()
    const $line = document.createElement('div')
    $line.textContent = line
    $terminal.appendChild($line)
  $terminal.scrollTop = $terminal.scrollHeight
  }
}

export {
  terminal,
  termRunner,
}
