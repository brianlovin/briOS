import * as React from 'react'
import slugify from 'slugify'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'

import { Textarea } from '../Input'
import { PostComposerActions } from './PostComposerActions'

export const PostComposerContext = React.createContext({
  title: '',
  text: '',
  slug: '',
  excerpt: '',
  setTitle: (title: string) => {},
  setText: (text: string) => {},
  setSlug: (slug: string) => {},
  setExcerpt: (excerpt: string) => {},
})

export function PostComposer() {
  const [title, setTitle] = React.useState('')
  const [text, setText] = React.useState('')
  const [slug, setSlug] = React.useState('')
  const [excerpt, setExcerpt] = React.useState('')

  const defaultContextValue = {
    title,
    text,
    slug,
    excerpt,
    setTitle,
    setText,
    setSlug,
    setExcerpt,
  }

  function handleTitleChange(e) {
    setTitle(e.target.value)
    setSlug(slugify(e.target.value, { lower: true }))
  }

  function handleSlugChange(e) {
    setSlug(slugify(e.target.value, { lower: true }))
  }

  return (
    <PostComposerContext.Provider value={defaultContextValue}>
      <Detail.Container>
        <TitleBar
          backButton
          globalMenu={false}
          backButtonHref={'/writing'}
          title={'New Post'}
          trailingAccessory={<PostComposerActions />}
        />

        <Detail.ContentContainer>
          <Detail.Header>
            <Textarea
              rows={1}
              autoFocus
              defaultValue={title}
              onChange={handleTitleChange}
              placeholder={'New post'}
              className="block w-full text-2xl font-bold focus:ring-0 composer focus:border-0 focus:outline-none md:text-3xl text-primary"
            />
            <Textarea
              rows={1}
              value={slug}
              onChange={handleSlugChange}
              placeholder={'Slug'}
              className="block w-full font-bold focus:ring-0 composer focus:border-0 focus:outline-none text-primary"
            />
            <span className="inline-block leading-snug text-tertiary">
              Draft
            </span>
          </Detail.Header>
        </Detail.ContentContainer>
      </Detail.Container>
    </PostComposerContext.Provider>
  )
}
