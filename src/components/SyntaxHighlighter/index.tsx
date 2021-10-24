import Prism from 'prismjs'
import * as React from 'react'

export function SyntaxHighlighter({ data }) {
  React.useEffect(() => {
    Prism.highlightAll()
  }, [data])
  return null
}
