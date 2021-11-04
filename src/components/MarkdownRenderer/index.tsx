import deepmerge from 'deepmerge'
import Link from 'next/link'
import * as React from 'react'
import Markdown from 'react-markdown'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

function LinkRenderer({ href, ...rest }: any) {
  const url = new URL(href)
  if (url.origin === 'https://brianlovin.com') {
    return (
      <Link href={href}>
        <a {...rest} />
      </Link>
    )
  }
  return <a target="_blank" rel="noopener" href={href} {...rest} />
}

function getComponentsForVariant(variant) {
  // Blog posts
  switch (variant) {
    case 'longform': {
      return {
        a: LinkRenderer,
      }
    }
    // Questions, comments, descriptions on bookmarks, etc.
    case 'comment': {
      return {
        a: LinkRenderer,
        h1: 'p',
        h2: 'p',
        h3: 'p',
        h4: 'p',
        h5: 'p',
        h6: 'p',
        code({ node, inline, className, children, ...props }) {
          return (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
      }
    }
  }
}

export function MarkdownRenderer(props: any) {
  // variant = 'longform' | 'comment'
  const { children, variant = 'longform', ...rest } = props

  const schema = deepmerge(defaultSchema, {
    attributes: { '*': ['className'] },
  })

  const components = getComponentsForVariant(variant)

  return (
    <Markdown
      {...rest}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeSanitize, schema]]}
      components={{
        a: LinkRenderer,
      }}
    >
      {children}
    </Markdown>
  )
}
