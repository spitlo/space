import { debug } from './utils'

let storage = {}

const load = () => {
  if (location.hash) {
    const hash = location.hash.slice(1)
    const escaped = atob(hash)
    const unescaped = unescape(escaped)
    storage = JSON.parse(unescaped)
    debug('In load: Storage is now', storage)
  }
}

const save = () => {
  const stringified = JSON.stringify(storage)
  const escaped = escape(stringified)
  const hash = btoa(escaped)
  location.hash = hash
}

const stash = (values) => {
  debug('Stashing values', values)
  storage = {
    ...storage,
    ...values,
  }
  debug('In stash: Storage is now', storage)
}

export {
  load,
  save,
  stash,
  storage,
}
