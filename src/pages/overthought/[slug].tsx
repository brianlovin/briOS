 
import * as React from 'react';
import useSWR from 'swr'
import cacheSsr from '~/lib/cacheSsr'
import { BlogPost } from '~/types';
import { getPostBySlug } from '~/data/ghost'
import Page from '~/components/Page';
import Post from '~/components/Overthought/Post'
import NotFound from '~/components/Overthought/NotFound';

interface Props {
  post: BlogPost;
  slug: string;
};

export function OverthoughtPost(props: Props) {
  const initialData = props.post
  const { data: post } = useSWR(`${props.slug}`, getPostBySlug, { initialData })

  return (
    <Page withHeader>
      { post
        ? <Post post={post} />
        : <NotFound />
      }
    </Page>
  )
}

OverthoughtPost.getInitialProps = async ({ query, res }) => {
  cacheSsr({ res })

  const post = await getPostBySlug(query.slug);
  return { post: post, slug: query.slug }
}

export default OverthoughtPost