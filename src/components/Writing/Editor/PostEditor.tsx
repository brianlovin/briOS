import * as React from 'react'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { useGetPostQuery } from '~/graphql/types.generated'

import { PostEditorActions } from './PostEditorActions'
import { PostEditorComposer } from './PostEditorComposer'
import { PostEditorMetaSidebar } from './PostEditorMetaSidebar'
import { PostEditorPreview } from './PostEditorPreview'
import { PreviewSwitch } from './PreviewSwitch'

export const PostEditorContext = React.createContext({
  draftState: {
    title: '',
    text: '',
    slug: '',
    excerpt: '',
  },
  setDraftState: (draftObj: unknown) => {},
  existingPost: null,
  sidebarIsOpen: false,
  setSidebarIsOpen: (isOpen: boolean) => {},
  isPreviewing: false,
  setIsPreviewing: (isPreviewing: boolean) => {},
})

export function PostEditor({ slug: propsSlug = '' }) {
  const scrollContainerRef = React.useRef(null)
  const { data } = useGetPostQuery({ variables: { slug: propsSlug } })

  const defaultDraftState = {
    title: data?.post?.title || '',
    text: data?.post?.text || '',
    slug: data?.post?.slug || '',
    excerpt: data?.post?.excerpt || '',
  }

  const [draftState, setDraftState] = React.useState(defaultDraftState)
  const [isPreviewing, setIsPreviewing] = React.useState(false)

  const existingPost = data?.post
  const [sidebarIsOpen, setSidebarIsOpen] = React.useState(false)

  React.useEffect(() => {
    // if navigating between drafts, reset the state each time with the correct
    // post data
    setDraftState(defaultDraftState)
  }, [propsSlug])

  const defaultContextValue = {
    existingPost,
    draftState,
    setDraftState,
    sidebarIsOpen,
    setSidebarIsOpen,
    isPreviewing,
    setIsPreviewing,
  }

  return (
    <PostEditorContext.Provider value={defaultContextValue}>
      <Detail.Container ref={scrollContainerRef}>
        <TitleBar
          backButton
          globalMenu={false}
          backButtonHref={'/writing'}
          scrollContainerRef={scrollContainerRef}
          title=""
          trailingAccessory={<PostEditorActions />}
          leadingAccessory={<PreviewSwitch />}
        />

        {isPreviewing ? <PostEditorPreview /> : <PostEditorComposer />}
      </Detail.Container>
      <PostEditorMetaSidebar />
    </PostEditorContext.Provider>
  )
}
