import * as React from 'react'
import toast from 'react-hot-toast'

import Button from '~/components/Button'
import { useEditPostMutation } from '~/graphql/types.generated'

import { LoadingSpinner } from '../LoadingSpinner'
import { PostEditorContext } from './PostEditor'

export function PostEditorActions() {
  const { title, text, slug, excerpt, post } =
    React.useContext(PostEditorContext)

  const [editPost, { loading }] = useEditPostMutation({
    onCompleted({ editPost }) {
      toast.success('Draft saved')
    },
  })

  function saveDraft() {
    editPost({
      variables: {
        id: post.id,
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
