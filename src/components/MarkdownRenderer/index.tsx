import Link from 'next/link'
import * as React from 'react'
import Markdown from 'react-markdown'

import { baseUrl } from '~/config/seo'

interface Props {
  children: string
  escapeHtml?: boolean
}

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

export function MarkdownRenderer(props: Props) {
  const { children, ...rest } = props

  return (
    <Markdown
      {...rest}
      components={{
        a: LinkRenderer,
      }}
    >
      {children}
    </Markdown>
  )
}
