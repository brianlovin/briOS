import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
export function CodeBlock({
  text,
  language,
  ...rest
}: {
  text: string
  language: string
  [key: string]: any
}) {
  return (
    <div className="relative group code-block">
      <SyntaxHighlighter
        showLineNumbers={!['bash', 'text', 'treeview'].includes(language)}
        useInlineStyles={false}
        language={language}
        children={text}
        style=""
        {...rest}
      />
    </div>
  )
}
