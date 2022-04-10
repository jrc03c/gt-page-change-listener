const proxify = require("./proxify.js")
const waitFor = require("./wait-for.js")

let dataHasBeenPermanentlySet, proxy, isListening

async function setUpListener() {
  if (isListening) return

  await waitFor(() => !!$)

  if (!dataHasBeenPermanentlySet) {
    await waitFor(() => !!window.data)

    const origData = window.data
    proxy = proxify(origData)

    Object.defineProperty(window, "data", {
      configurable: false,
      enumerable: true,
      writable: false,
      value: proxy.object,
    })

    dataHasBeenPermanentlySet = true
  }

  isListening = true
  proxy.logs.splice(0, proxy.logs.length)
  let lastLogsLength = 0

  let interval = setInterval(() => {
    if (!isListening) {
      clearInterval(interval)
      return
    }

    if (proxy.logs.length > lastLogsLength) {
      const newLogs = proxy.logs.slice(lastLogsLength)

      newLogs.forEach(item => {
        if (
          item.type === "set" &&
          item.prop === "unsynced_documents" &&
          item.value &&
          item.value.length > 0
        ) {
          $(window).trigger("gt-page-change")
        }
      })
    }

    proxy.logs.splice(0, proxy.logs.length)
    lastLogsLength = 0
  }, 100)
}

$(window).on("start-gt-page-change-listener", () => {
  setUpListener()
})

$(window).on("stop-gt-page-change-listener", () => {
  isListening = false
})

setUpListener()
