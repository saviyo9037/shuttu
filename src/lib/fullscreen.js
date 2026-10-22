export const enterFullscreen = () => {
  const el = document.documentElement
  const req = el.requestFullscreen || el.webkitRequestFullscreen
  if (req) { try { Promise.resolve(req.call(el)).catch(() => {}) } catch { /* denied */ } }
}

export const exitFullscreen = () => {
  const exit = document.exitFullscreen || document.webkitExitFullscreen
  if ((document.fullscreenElement || document.webkitFullscreenElement) && exit) {
    try { Promise.resolve(exit.call(document)).catch(() => {}) } catch { /* ignore */ }
  }
}
