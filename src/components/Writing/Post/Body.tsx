import * as React from 'react'
import unified from 'unified'
import parse from 'rehype-parse'
import rehype2remark from 'rehype-remark'
import stringify from 'remark-stringify'
import { Post } from '~/graphql/types.generated'
import { MarkdownRenderer } from '~/components/MarkdownRenderer'
import raw from 'rehype-raw'
import sanitize from 'rehype-sanitize'

interface Props {
  post: Post
}

export default function Body({ post }: Props) {
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
