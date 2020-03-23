 
import * as React from 'react';
import { BlogPost } from '~/types';
import { fetcher, swr } from '~/api'
import { POST, POSTS } from '~/api/queries'
import Page from '~/components/Page';
import Post from '~/components/Overthought/Post'
import NotFound from '~/components/Overthought/NotFound';

interface Props {
  data: {
    post: BlogPost;
    posts: BlogPost[];
  }
  slug: string;
};

function OverthoughtPost(props: Props) {
  const { data: postData } = swr({ query: POST, variables: { slug: props.slug}, initialData: props.data.post})
  const { data: postsData } = swr({ query: POSTS, initialData: props.data.posts})
  
  return (
    <Page withHeader>
      { postData
        ? <Post post={postData} posts={postsData.posts} />
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

  const data = { ...postQuery, ...postsQuery }

  return { props: { data, slug }}
}

export default OverthoughtPost