window.queue = window.queue || []

// This does not work at all :)

const terminal = (terminalText) => {
  console.log(window.queue)
  if (terminalText) {
    // If triggered with text content, push text content to queue
    window.queue.push(terminalText)
  }

  // Now see if we have a queue to handle
  if (window.queue.length) {
    const text = window.queue.shift()
    const textLines = text.split('\n')
    for (let i = 0; i < textLines.length; i++) {
      setTimeout(() => {
        const $line = document.createElement('div')
        $line.textContent = textLines[i]
        if (i === textLines.length - 1) {
          $line.classList.add('last')
        }
        document.querySelector('#terminal').appendChild($line)
      }, 200 * i)
    }

    // Do we still have text to print?
    if (window.queue.length) {
      terminal()
    }
  }


}

export {
  terminal,
}
