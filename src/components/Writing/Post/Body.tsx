import * as React from 'react'
import parse from 'rehype-parse'
import raw from 'rehype-raw'
import rehype2remark from 'rehype-remark'
import sanitize from 'rehype-sanitize'
import stringify from 'remark-stringify'
import { unified } from 'unified'

import { MarkdownRenderer } from '~/components/MarkdownRenderer'
import { Post } from '~/graphql/types.generated'

interface Props {
  post: Post
}

export function Body({ post }: Props) {
  const md = unified()
    .use(parse)
    .use(rehype2remark)
    .use(stringify)
    .use(raw)
    .use(sanitize)
    .processSync(post.html)
    .toString()

  return <MarkdownRenderer>{md}</MarkdownRenderer>
}
