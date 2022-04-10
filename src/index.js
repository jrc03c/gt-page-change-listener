const proxify = require("./proxify.js")
const waitFor = require("./wait-for.js")

async function setUpListener() {
  await waitFor(() => !!$)
  await waitFor(() => !!window.data)

  let proxy = null
  const origData = window.data
  proxy = proxify(origData)

  Object.defineProperty(window, "data", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: proxy.object,
  })

  let lastLogsLength = 0

  let interval = setInterval(() => {
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

  $(window).on("stop-gt-page-change-listener", () => {
    clearInterval(interval)
  })
}

setUpListener()
