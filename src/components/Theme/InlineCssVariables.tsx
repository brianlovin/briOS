/*
This code comes from https://joshwcomeau.com/gatsby/dark-mode/
It uses the users' prefers-color-scheme media query to inline
CSS variables into the :root of the page before any content is 
rendered.
*/

import Terser from 'terser'
import { COLORS } from './colors'

export function setColorsByTheme() {
  const colors = '🌈'

  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  const prefersDarkFromMQ = mql.matches
  const colorMode = prefersDarkFromMQ ? 'dark' : 'light'

  const root = document.documentElement

  Object.entries(colors).forEach(([name, colorByTheme]) => {
    const cssVarName = `--${name}`

    root.style.setProperty(cssVarName, colorByTheme[colorMode])
  })
}

export function MagicScriptTag() {
  const boundFn = String(setColorsByTheme).replace(
    "'🌈'",
    JSON.stringify(COLORS)
  )

  let calledFunction = `(${boundFn})()`

  calledFunction = Terser.minify(calledFunction).code

  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: calledFunction }} />
}

// if user doesn't have JavaScript enabled, set variables properly in a
// head style tag anyways (light mode)
export function FallbackStyles() {
  const cssVariableString = Object.entries(COLORS).reduce(
    (acc, [name, colorByTheme]) => {
      return `${acc}\n--color-${name}: ${colorByTheme.light};`
    },
    ''
  )

  const wrappedInSelector = `html { ${cssVariableString} }`

  return <style>{wrappedInSelector}</style>
}
