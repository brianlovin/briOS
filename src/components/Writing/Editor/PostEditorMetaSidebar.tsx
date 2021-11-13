import * as React from 'react'
import { X } from 'react-feather'

import Button, { GhostButton, PrimaryButton } from '~/components/Button'
import { Input, Textarea } from '~/components/Input'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import { GET_POSTS } from '~/graphql/queries/posts'
import {
  useEditPostMutation,
  useGetPostsQuery,
} from '~/graphql/types.generated'

import { PostEditorContext } from './PostEditor'

export function PostEditorMetaSidebar() {
  const context = React.useContext(PostEditorContext)
  const {
    draftState,
    existingPost,
    setDraftState,
    sidebarIsOpen,
    setSidebarIsOpen,
  } = context
  const scrollContainerRef = React.useRef(null)

  const [editPost, { loading: editingPost }] = useEditPostMutation()

  function handlePublish() {
    // if already publish, don't try to publish again
    if (existingPost.publishedAt) return

    return editPost({
      variables: {
        id: existingPost.id,
        data: { ...draftState, published: true },
      },
      refetchQueries: [GET_POSTS],
    })
  }

  function handleUnpublish() {
    // if it's not published already, don't try to unpublish
    if (!existingPost.publishedAt) return

    return editPost({
      variables: {
        id: existingPost.id,
        data: { ...draftState, published: false },
      },
      refetchQueries: [GET_POSTS],
    })
  }

  function handleSlugChange(e) {
    return setDraftState((draft) => ({ ...draft, slug: e.target.value }))
  }

  function handleExcerptChange(e) {
    return setDraftState((draft) => ({ ...draft, excerpt: e.target.value }))
  }

  return (
    <>
      <nav
        ref={scrollContainerRef}
        className={`${
          sidebarIsOpen
            ? 'absolute inset-y-0 right-0 translate-x-0 shadow-lg'
            : 'absolute right-0 translate-x-full'
        } flex flex-none flex-col w-3/4 sm:w-1/2 md:w-1/3 lg:w-56 2xl:w-72 3xl:w-80 z-30 max-h-screen h-full min-h-screen overflow-y-auto transition duration-200 ease-in-out transform bg-white border-l pb-10 sm:pb-0 border-gray-150 dark:bg-gray-900 dark:border-gray-800`}
      >
        <TitleBar
          scrollContainerRef={scrollContainerRef}
          leadingAccessory={null}
          trailingAccessory={
            <GhostButton size="small-square" aria-label="Close details">
              <X size={16} onClick={() => setSidebarIsOpen(false)} />
            </GhostButton>
          }
          globalMenu={false}
          title="Details"
        />

        <div className="flex-1 px-3 py-3 space-y-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold text-primary">Slug</p>
            <Input
              placeholder="Slug"
              value={draftState.slug}
              onChange={handleSlugChange}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold text-primary">Excerpt</p>
            <Textarea
              value={draftState.excerpt}
              placeholder="Excerpt"
              rows={8}
              maxRows={8}
              onChange={handleExcerptChange}
            />
          </div>
        </div>

        <div className="sticky bottom-0 z-10 flex items-center justify-between p-2 space-x-3 bg-white border-t border-gray-150 dark:bg-gray-900 dark:border-gray-800 bg-opacity-80 filter-blur dark:bg-opacity-60">
          {existingPost?.id && !existingPost?.publishedAt && (
            <PrimaryButton
              style={{ width: '100%' }}
              disabled={editingPost}
              onClick={handlePublish}
            >
              {editingPost ? <LoadingSpinner /> : 'Publish'}
            </PrimaryButton>
          )}
          {existingPost?.id && existingPost?.publishedAt && (
            <Button
              style={{ width: '100%' }}
              disabled={editingPost}
              onClick={handleUnpublish}
            >
              {editingPost ? <LoadingSpinner /> : 'Unpublish'}
            </Button>
          )}
        </div>
      </nav>

      <div
        className={`fixed bg-black bg-opacity-5 dark:bg-opacity-50 transition duration-200 ease-in-out inset-0 z-20 ${
          sidebarIsOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarIsOpen(false)}
      />
    </>
  )
}
