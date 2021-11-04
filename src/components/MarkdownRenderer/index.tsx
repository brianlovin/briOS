import deepmerge from 'deepmerge'
import Link from 'next/link'
import * as React from 'react'
import Markdown from 'react-markdown'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import linkifyRegex from 'remark-linkify-regex'

function LinkRenderer({ href, ...rest }: any) {
  if (href.startsWith('@')) {
    // link to a mention
    return (
      <Link href={`/u/${href.slice(1)}`} {...rest}>
        <a {...rest} />
      </Link>
    )
  }
  try {
    const url = new URL(href)
    if (url.origin === 'https://brianlovin.com') {
      return (
        <Link href={href}>
          <a {...rest} />
        </Link>
      )
    }
    return <a target="_blank" rel="noopener" href={href} {...rest} />
  } catch (e) {
    console.error(e)
    return <a target="_blank" rel="noopener" href={href} {...rest} />
  }
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
      remarkPlugins={[remarkGfm, linkifyRegex(/^(?!.*\bRT\b)(?:.+\s)?@\w+/i)]}
      rehypePlugins={[[rehypeSanitize, schema]]}
      components={components}
    >
      {children}
    </Markdown>
  )
}
