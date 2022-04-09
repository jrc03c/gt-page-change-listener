function downloadText(text, filename) {
  let a = document.createElement("a")
  a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  a.download = filename
  a.dispatchEvent(new MouseEvent("click"))
}

function proxify(x) {
  const logs = []

  function downloadLogs() {
    return downloadText(JSON.stringify(logs, null, 2), "logs.json")
  }

  function helper(x) {
    if (typeof x === "object" || typeof x === "function") {
      if (x === null) return null

      return new Proxy(x, {
        get(target, prop, receiver) {
          logs.push({
            type: "get",
            prop: prop,
            time: new Date().getTime(),
          })

          const out = Reflect.get(...arguments)

          if (
            prop &&
            typeof prop === "string" &&
            prop.toLowerCase().includes("prototype")
          ) {
            return out
          } else {
            return helper(out)
          }
        },

        set(target, prop, value) {
          logs.push({
            type: "set",
            prop,
            value,
            time: new Date().toLocaleString(),
          })

          const out = Reflect.set(...arguments)

          if (
            prop &&
            typeof prop === "string" &&
            prop.toLowerCase().includes("prototype")
          ) {
            return out
          } else {
            return helper(out)
          }
        },
      })
    } else {
      return x
    }
  }

  return {
    orig: x,
    object: helper(x),
    logs,
    downloadLogs,
  }
}
