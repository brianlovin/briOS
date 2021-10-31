import * as React from 'react'
import slugify from 'slugify'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { useGetPostQuery } from '~/graphql/types.generated'

import { Textarea } from '../Input'
import { PostEditorActions } from './PostEditorActions'

export const PostEditorContext = React.createContext({
  title: '',
  text: '',
  slug: '',
  excerpt: '',
  setTitle: (title: string) => {},
  setText: (text: string) => {},
  setSlug: (slug: string) => {},
  setExcerpt: (excerpt: string) => {},
  post: null,
})

export function PostEditor(props) {
  const { data } = useGetPostQuery({ variables: { slug: props.slug } })
  const { post } = data
  const [title, setTitle] = React.useState(post.title)
  const [text, setText] = React.useState(post.text)
  const [slug, setSlug] = React.useState(post.slug)
  const [excerpt, setExcerpt] = React.useState(post.excerpt)

  const defaultContextValue = {
    title,
    text,
    slug,
    excerpt,
    setTitle,
    setText,
    setSlug,
    setExcerpt,
    post,
  }

  function handleTitleChange(e) {
    setTitle(e.target.value)
    setSlug(slugify(e.target.value, { lower: true }))
  }

  function handleSlugChange(e) {
    setSlug(slugify(e.target.value, { lower: true }))
  }

  return (
    <PostEditorContext.Provider value={defaultContextValue}>
      <Detail.Container>
        <TitleBar
          backButton
          globalMenu={false}
          backButtonHref={'/writing'}
          title={'Edit Post'}
          trailingAccessory={<PostEditorActions />}
        />

        <Detail.ContentContainer>
          <Detail.Header>
            <Textarea
              rows={1}
              autoFocus
              defaultValue={title}
              onChange={handleTitleChange}
              placeholder={'Post title'}
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
    </PostEditorContext.Provider>
  )
}
