import * as React from 'react'

import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import { PostEditor } from '~/components/Writing/Editor/PostEditor'
import { PostDetail } from '~/components/Writing/PostDetail'
import { PostsList } from '~/components/Writing/PostsList'
import { getContext } from '~/graphql/context'
import { GET_COMMENTS } from '~/graphql/queries/comments'
import { GET_POST, GET_POSTS } from '~/graphql/queries/posts'
import { GET_VIEWER } from '~/graphql/queries/viewer'
import { CommentType, useGetPostQuery } from '~/graphql/types.generated'
import { addApolloState, initApolloClient } from '~/lib/apollo'

function WritingPostPage({ slug }) {
  const { data } = useGetPostQuery({ variables: { slug } })
  if (data?.post && !data.post.publishedAt) return <PostEditor slug={slug} />
  return <PostDetail slug={slug} />
}

export async function getServerSideProps({ params: { slug }, req, res }) {
  const context = await getContext(req, res)
  const apolloClient = initApolloClient({ context })

  const { data } = await apolloClient.query({
    query: GET_POST,
    variables: { slug },
  })

  await Promise.all([
    apolloClient.query({ query: GET_VIEWER }),
    apolloClient.query({ query: GET_POSTS }),

    data?.post?.id &&
      apolloClient.query({
        query: GET_COMMENTS,
        variables: { refId: data.post.id, type: CommentType.Bookmark },
      }),
  ])

  return addApolloState(apolloClient, {
    props: {
      slug,
    },
  })
}

WritingPostPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<PostsList />} hasDetail detail={page} />
    </SiteLayout>
  )
})

export default WritingPostPage
