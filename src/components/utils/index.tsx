export const hexa = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16)

  const g = parseInt(hex.slice(3, 5), 16)

  const b = parseInt(hex.slice(5, 7), 16)

  if (alpha >= 0) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return `rgb(${r}, ${g}, ${b})`
}

export const tint = (hex: string, amount: number) => {
  let R = parseInt(hex.substring(1, 3), 16)
  let G = parseInt(hex.substring(3, 5), 16)
  let B = parseInt(hex.substring(5, 7), 16)

  const getSingle = (number: number) =>
    // @ts-ignore
    parseInt((number * (100 + amount)) / 100, 10)

  R = getSingle(R)
  G = getSingle(G)
  B = getSingle(B)

  R = R < 255 ? R : 255
  G = G < 255 ? G : 255
  B = B < 255 ? B : 255

  const getDouble = (number: number) =>
    number.toString(16).length === 1
      ? `0${number.toString(16)}`
      : number.toString(16)

  const RR = getDouble(R)
  const GG = getDouble(G)
  const BB = getDouble(B)

  return `#${RR}${GG}${BB}`
}
