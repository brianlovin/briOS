export function validEmail(email) {
  // eslint-disable-next-line
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export function validUsername(username) {
  // eslint-disable-next-line
  const re = /^(?=[a-zA-Z0-9_]{4,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/
  return re.test(String(username))
}

export function validUrl(string) {
  try {
    new URL(string)
    return true
  } catch (err) {
    return false
  }
}
