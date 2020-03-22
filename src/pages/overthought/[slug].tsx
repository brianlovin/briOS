 
import * as React from 'react';
import { BlogPost } from '~/types';
import { fetcher } from '~/api'
import { POST, POSTS } from '~/api/queries'
import Page from '~/components/Page';
import Post from '~/components/Overthought/Post'
import NotFound from '~/components/Overthought/NotFound';

interface Props {
  post: BlogPost;
  posts: BlogPost[];
  slug: string;
};

function OverthoughtPost(props: Props) {
  const { post, posts } = props

  return (
    <Page withHeader>
      { post.id
        ? <Post post={post} posts={posts} />
        : <NotFound />
      }
    </Page>
  )
}

export async function getStaticPaths() {
  const { posts } = await fetcher(POSTS);
  const paths = posts.map(({ slug }) => ({
    params: { slug }
  }))
  
  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  const [{ post }, { posts }] = await Promise.all([
    fetcher(POST(params.slug)),
    fetcher(POSTS)
  ])

  return { props: { post, posts, slug: params.slug  }}
}

export default OverthoughtPost