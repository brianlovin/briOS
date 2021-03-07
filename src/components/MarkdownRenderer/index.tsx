import * as React from 'react'
import Link from 'next/link'
import Prism from 'prismjs'
import htmlParser from 'react-markdown/plugins/html-parser'
import Markdown from 'react-markdown'
import { baseUrl } from '~/config/seo'

interface Props {
  children: string
  escapeHtml?: boolean
}

const parseHtml = htmlParser({
  isValidNode: (node) => node.type !== 'script',
})

function LinkRenderer(props: any) {
  const { href, children } = props
  const isSelf = href.indexOf(baseUrl) === 0
  if (isSelf) {
    return (
      <Link href={href === baseUrl ? '/' : href.replace(baseUrl, '')}>
        <a>{children}</a>
      </Link>
    )
  }

  return <a href={href}>{children}</a>
}

export default function MarkdownRenderer(props: Props) {
  const { children, ...rest } = props

  React.useEffect(() => {
    Prism.highlightAll()
  }, [children])

  return (
    <Markdown
      {...rest}
      astPlugins={[parseHtml]}
      renderers={{
        link: LinkRenderer,
      }}
    >
      {children}
    </Markdown>
  )
}
