import * as React from 'react'

import { Textarea } from '~/components/Input'
import { Detail } from '~/components/ListDetail/Detail'

import { PostEditorContext } from './PostEditor'

export function PostEditorComposer() {
  const context = React.useContext(PostEditorContext)
  const { draftState, setDraftState } = context

  function handleTitleChange(e) {
    setDraftState((draft) => ({ ...draft, title: e.target.value }))
  }

  function handleTextChange(e) {
    setDraftState((draft) => ({ ...draft, text: e.target.value }))
  }

  return (
    <Detail.ContentContainer>
      <Detail.Header>
        <Textarea
          rows={1}
          value={draftState.title}
          onChange={handleTitleChange}
          placeholder={'Post title'}
          className="block w-full p-0 text-2xl font-bold prose lg:prose-lg dark:bg-black focus:ring-0 composer focus:border-0 focus:outline-none md:text-3xl text-primary"
        />
        <Textarea
          rows={20}
          maxRows={2000}
          value={draftState.text}
          onChange={handleTextChange}
          placeholder={'Write a post...'}
          className="block w-full p-0 pt-5 text-lg font-normal prose lg:prose-lg dark:bg-black focus:ring-0 composer focus:border-0 focus:outline-none text-primary"
        />
      </Detail.Header>
    </Detail.ContentContainer>
  )
}
