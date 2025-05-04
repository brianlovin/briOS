import { useRouter } from 'next/router'
import * as React from 'react'
import { Sidebar } from 'react-feather'
import toast from 'react-hot-toast'
import slugify from 'slugify'

import Button from '~/components/Button'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import {
  useAddPostMutation,
  useEditPostMutation,
} from '~/graphql/types.generated'

import { PostEditorContext } from './PostEditor'
import { PostEditorAutoSave } from './PostEditorAutoSave'

export function PostEditorActions() {
  const router = useRouter()
  const context = React.useContext(PostEditorContext)
  const {
    draftState,
    existingPost,
    sidebarIsOpen,
    setSidebarIsOpen,
    isPreviewing,
    setIsPreviewing,
  } = context

  const [addPost, { loading: creatingPost }] = useAddPostMutation({
    onCompleted({ addPost }) {
      toast.success('Draft created')
      router.push({
        pathname: '/writing/[slug]/edit',
        query: { slug: addPost.slug },
      })
    },
  })

  const [editPost, { loading: editingPost }] = useEditPostMutation()

  function handleEditOrCreate() {
    if (existingPost?.id) {
      return editPost({
        variables: {
          id: existingPost.id,
          data: draftState,
        },
      })
    }

    return addPost({
      variables: {
        data: {
          ...draftState,
          slug: draftState.slug || slugify(draftState.title, { lower: true }),
        },
      },
    })
  }

  const isSavingDraft = editingPost || creatingPost

  return (
    <div className="flex items-center space-x-2">
      <Button disabled={isSavingDraft} onClick={handleEditOrCreate}>
        {isSavingDraft ? (
          <LoadingSpinner />
        ) : (
          <>
            <PostEditorAutoSave />{' '}
            <span>{existingPost?.publishedAt ? 'Update' : 'Save draft'}</span>
          </>
        )}
      </Button>
      <Button onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
        <Sidebar size={16} />
      </Button>
    </div>
  )
}
