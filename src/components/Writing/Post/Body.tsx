import * as React from 'react'
import unified from 'unified'
import parse from 'rehype-parse'
import rehype2remark from 'rehype-remark'
import stringify from 'remark-stringify'
import { Post } from '~/graphql/types.generated'
import Markdown from '~/components/MarkdownRenderer'

interface Props {
  post: Post
}

export default function Body({ post }: Props) {
  const md = unified()
    .use(parse)
    .use(rehype2remark)
    .use(stringify)
    .processSync(post.html)
    .toString()

  return <Markdown>{md}</Markdown>
}
