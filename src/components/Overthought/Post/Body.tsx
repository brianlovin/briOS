 
import * as React from 'react';
import unified from 'unified'
import parse from 'rehype-parse'
import rehype2remark from 'rehype-remark'
import stringify from 'remark-stringify'
import { BlogPost } from '~/types';
import Markdown from '~/components/MarkdownRenderer';

interface Props {
  post: BlogPost;
};

export default function Post({ post }) {
  const md = unified()
    .use(parse)
    .use(rehype2remark)
    .use(stringify)
    .processSync(post.html)
    .toString()

  return (
    <Markdown>{md}</Markdown>
  )
}