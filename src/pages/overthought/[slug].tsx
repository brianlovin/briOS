 
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

  if (!post) return null

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
  const data = await fetcher(POSTS);
  
  if (!data) return { paths: [], fallback: true }

  const paths = data.posts.map(({ slug }) => ({
    params: { slug }
  }))
  
  return { paths, fallback: true }
}

export async function getStaticProps({ params: { slug } }) {
  const [ postQuery, postsQuery ] = await Promise.all([
    fetcher(POST, { slug }),
    fetcher(POSTS)
  ])

  const post = postQuery ? postQuery.post : null
  const posts = postsQuery ? postsQuery.posts : null

  return { props: { post, posts, slug }}
}

export default OverthoughtPost