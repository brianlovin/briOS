import * as React from 'react';
import Prism from 'prismjs'

export default function SyntaxHighlighter() {
  React.useEffect(() => {
    Prism.highlightAll()
  }, [])
  return null
}
