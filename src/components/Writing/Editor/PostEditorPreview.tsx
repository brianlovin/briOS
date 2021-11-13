import * as React from 'react'

import { Detail } from '~/components/ListDetail/Detail'
import { MarkdownRenderer } from '~/components/MarkdownRenderer'

import { PostEditorContext } from './PostEditor'

export function PostEditorPreview() {
  const context = React.useContext(PostEditorContext)
  const { draftState } = context
  const { title, text } = draftState

  return (
    <Detail.ContentContainer>
      <Detail.Header>
        <Detail.Title>{title}</Detail.Title>
      </Detail.Header>

      <MarkdownRenderer children={text} className="mt-8 prose lg:prose-lg" />

      {/* bottom padding to give space between post content and comments */}
      <div className="py-6" />
    </Detail.ContentContainer>
  )
}
