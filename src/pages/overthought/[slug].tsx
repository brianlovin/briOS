 
import * as React from 'react';
import useSWR from 'swr'
import { BlogPost } from '~/types';
import { getPostBySlug, getFeaturedPosts } from '~/data/ghost'
import Page from '~/components/Page';
import Post from '~/components/Overthought/Post'
import NotFound from '~/components/Overthought/NotFound';

interface Props {
  post: BlogPost;
  slug: string;
};

function OverthoughtPost(props: Props) {
  const initialData = props.post
  const { data } = useSWR(`${props.slug}`, getPostBySlug, { initialData })

  return (
    <Page withHeader>
      { data
        ? <Post post={data} />
        : <NotFound />
      }
    </Page>
  )
}

export async function getStaticPaths() {
  const posts = await getFeaturedPosts();
  const paths = posts.map(({ slug }) => ({
    params: { slug }
  }))
  
  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  return { props: { post, slug: params.slug  }}
}

export default OverthoughtPost