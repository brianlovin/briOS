import { useRouter } from 'next/router'
import * as React from 'react'
import toast from 'react-hot-toast'

import Button from '~/components/Button'
import { useAddPostMutation } from '~/graphql/types.generated'

import { LoadingSpinner } from '../LoadingSpinner'
import { PostComposerContext } from './PostComposer'

export function PostComposerActions() {
  const router = useRouter()
  const { title, text, slug, excerpt } = React.useContext(PostComposerContext)

  const [addPost, { loading }] = useAddPostMutation({
    onCompleted({ addPost }) {
      toast.success('Draft saved')
      router.push({
        pathname: '/writing/[slug]/edit',
        query: { slug: addPost.id },
      })
    },
  })

  function saveDraft() {
    addPost({
      variables: {
        data: { title, text, slug, excerpt },
      },
    })
  }

  return (
    <Button disabled={loading} onClick={saveDraft}>
      {loading ? <LoadingSpinner /> : 'Save'}
    </Button>
  )
}
