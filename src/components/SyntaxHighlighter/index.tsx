import * as React from 'react'
import Prism from 'prismjs'

export default function SyntaxHighlighter({ data }) {
  React.useEffect(() => {
    Prism.highlightAll()
  }, [data])
  return null
}
