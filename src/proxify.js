function proxify(x) {
  const logs = []

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
  }
}

if (typeof module !== "undefined") {
  module.exports = proxify
}

if (typeof window !== "undefined") {
  window.proxify = proxify
}
