function waitFor(fn, ms) {
  return new Promise((resolve, reject) => {
    try {
      ms = ms || 100

      let interval = setInterval(() => {
        try {
          if (fn()) {
            clearInterval(interval)
            resolve()
          }
        } catch (e) {
          clearInterval(interval)
          reject(e)
        }
      }, ms)
    } catch (e) {
      reject(e)
    }
  })
}

if (typeof module !== "undefined") {
  module.exports = waitFor
}

if (typeof window !== "undefined") {
  window.waitFor = waitFor
}
