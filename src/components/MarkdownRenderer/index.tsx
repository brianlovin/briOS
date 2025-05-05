import deepmerge from 'deepmerge'
import Link from 'next/link'
import * as React from 'react'
import Markdown, { Components } from 'react-markdown'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import linkifyRegex from 'remark-linkify-regex'

import { CodeBlock } from './CodeBlock'

function LinkRenderer({ href, ...rest }: any) {
  // auto-link headings
  if (href.startsWith('#')) {
    return <a href={href} {...rest} />
  }

  if (href.startsWith('@')) {
    // link to a mention
    return <Link href={`/u/${href.slice(1)}`} {...rest} />
  }
  try {
    const url = new URL(href)
    if (url.origin === 'https://brianlovin.com') {
      return <Link href={href} {...rest} />
    }
    return <a target="_blank" rel="noopener" href={href} {...rest} />
  } catch (e) {
    console.error(e)
    return <a target="_blank" rel="noopener" href={href} {...rest} />
  }
}

function getComponentsForVariant(variant: 'longform' | 'comment'): Components {
  // Blog posts
  switch (variant) {
    case 'longform': {
      return {
        a: LinkRenderer,
        pre({
          children,
          className,
          ...props
        }: React.ComponentPropsWithoutRef<'pre'>) {
          const language = /language-(\w+)/.exec(className || '')?.[1]
          return language ? (
            <CodeBlock
              text={String(children).replace(/\n$/, '')}
              language={language}
              {...props}
            />
          ) : (
            <pre className={className} {...props}>
              {children}
            </pre>
          )
        },
        code({
          children,
          className,
          ...props
        }: React.ComponentPropsWithoutRef<'code'>) {
          const language = /language-(\w+)/.exec(className || '')?.[1]
          return language ? (
            <CodeBlock
              text={String(children).replace(/\n$/, '')}
              language={language}
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
      }
    }
    // Questions, comments, descriptions on bookmarks, etc.
    case 'comment': {
      return {
        a: LinkRenderer,
        h1: 'p' as const,
        h2: 'p' as const,
        h3: 'p' as const,
        h4: 'p' as const,
        h5: 'p' as const,
        h6: 'p' as const,
        pre({
          children,
          className,
          ...props
        }: React.ComponentPropsWithoutRef<'pre'>) {
          return (
            <pre className={className} {...props}>
              {children}
            </pre>
          )
        },
        code({
          children,
          className,
          ...props
        }: React.ComponentPropsWithoutRef<'code'>) {
          const language = /language-(\w+)/.exec(className || '')?.[1]
          return language ? (
            <CodeBlock
              text={String(children).replace(/\n$/, '')}
              language={language}
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
      }
    }
  }
}

type MarkdownRendererProps = {
  children: string
  variant?: 'longform' | 'comment'
  className?: string
} & Omit<React.ComponentProps<typeof Markdown>, 'children' | 'className'>

export function MarkdownRenderer({
  children,
  variant = 'longform',
  className,
  ...rest
}: MarkdownRendererProps) {
  const schema = deepmerge(defaultSchema, {
    tagNames: [...defaultSchema.tagNames, 'sup', 'sub', 'section'],
    attributes: {
      '*': ['className'],
    },
    clobberPrefix: '',
    clobber: ['name', 'id'],
  })

  const components = getComponentsForVariant(variant)

  return (
    <div className={className}>
      <Markdown
        {...rest}
        remarkPlugins={[remarkGfm, linkifyRegex(/^(?!.*\bRT\b)(?:.+\s)?@\w+/i)]}
        rehypePlugins={[
          [rehypeSanitize, schema],
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ]}
        components={components}
      >
        {children}
      </Markdown>
    </div>
  )
}
