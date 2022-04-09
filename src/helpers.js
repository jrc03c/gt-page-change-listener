function downloadText(text, filename) {
  let a = document.createElement("a")
  a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  a.download = filename
  a.dispatchEvent(new MouseEvent("click"))
}
