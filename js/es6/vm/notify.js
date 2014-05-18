
var timeout = null;

var notify = (msg, klass, icon) => {
  if (timeout !== null) {
    clearTimeout(timeout)
    timeout = null
  }
  window.app.notification = { msg: msg, klass: klass, icon: icon }
  timeout = setTimeout(() => {
    window.app.notification = null
    timeout = null
  }, 3000)
}

export { notify }
