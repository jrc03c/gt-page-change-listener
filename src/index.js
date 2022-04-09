const proxify = require("./proxify.js")
let proxy = null

let interval = setInterval(() => {
  if (!window.data) return
  clearInterval(interval)

  const origData = window.data
  proxy = proxify(origData)

  Object.defineProperty(window, "data", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: proxy.object,
  })
}, 1)

class GTPageChangeListener {
  static callbacks = []
  static isListening = false

  static addCallback(fn) {
    if (typeof fn !== "function") {
      throw new Error("You must pass a function into the `addCallback` method!")
    }

    GTPageChangeListener.callbacks.push(fn)

    if (!GTPageChangeListener.isListening) {
      GTPageChangeListener.start()
    }

    return GTPageChangeListener
  }

  static removeCallback(fn) {
    if (typeof fn !== "function") {
      throw new Error(
        "You must pass a function into the `removeCallback` method!"
      )
    }

    GTPageChangeListener.callbacks.splice(
      GTPageChangeListener.callbacks.indexOf(fn),
      1
    )

    if (GTPageChangeListener.callbacks.length === 0) {
      GTPageChangeListener.stop()
    }

    return GTPageChangeListener
  }

  static start() {
    if (GTPageChangeListener.isListening) return
    GTPageChangeListener.isListening = true
    let lastLogsLength = 0

    let interval = setInterval(() => {
      if (!GTPageChangeListener.isListening) {
        clearInterval(interval)
        return
      }

      if (!proxy) return

      if (proxy.logs.length > lastLogsLength) {
        const newLogs = proxy.logs.slice(lastLogsLength)

        newLogs.forEach(item => {
          if (
            item.type === "set" &&
            item.prop === "unsynced_documents" &&
            item.value &&
            item.value.length > 0
          ) {
            GTPageChangeListener.callbacks.forEach(fn => fn())
          }
        })
      }

      proxy.logs.splice(0, proxy.logs.length)
      lastLogsLength = 0
    }, 100)

    return GTPageChangeListener
  }

  static stop() {
    GTPageChangeListener.isListening = false
    return GTPageChangeListener
  }
}

if (typeof module !== "undefined") {
  module.exports = GTPageChangeListener
}

if (typeof window !== "undefined") {
  window.GTPageChangeListener = GTPageChangeListener
}
