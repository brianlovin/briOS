import { useRouter } from 'next/router'
import * as React from 'react'

import { ErrorAlert } from '~/components/Alert'
import { PrimaryButton } from '~/components/Button'
import { Textarea } from '~/components/Input'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import {
  useAddQuestionMutation,
  useViewerQuery,
} from '~/graphql/types.generated'

import { Avatar } from '../Avatar'

export function AddQuestionForm({ closeModal }) {
  const { data } = useViewerQuery()
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [error, setError] = React.useState('')
  const router = useRouter()

  const [handleAddQuestion, { loading }] = useAddQuestionMutation({
    onCompleted: ({ addQuestion: { id } }) => {
      closeModal()
      return router.push(`/ama/${id}`)
    },
    onError({ message }) {
      const clean = message.replace('GraphQL error:', '')
      setError(clean)
    },
  })

  function onSubmit(e) {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Question can’t be blank')
      return
    }

    return handleAddQuestion({
      variables: {
        data: {
          title,
          description,
        },
      },
    })
  }

  function onTitleChange(e) {
    error && setError('')
    return setTitle(e.target.value)
  }

  function onDescriptionChange(e) {
    error && setError('')
    return setDescription(e.target.value)
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && e.metaKey) {
      return onSubmit(e)
    }
  }

  const { viewer } = data

  return (
    <form className="items-stretch space-y-4 p-4" onSubmit={onSubmit}>
      <div className="flex items-start space-x-3">
        <div className="pt-0.5">
          <Avatar
            user={viewer}
            src={viewer.avatar}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <Textarea
          rows={1}
          value={title}
          placeholder="Ask me anything..."
          onChange={onTitleChange}
          onKeyDown={onKeyDown}
        />
      </div>
      <div className="pl-12">
        <Textarea
          rows={4}
          value={description}
          placeholder="Optional: add a description with more details..."
          onChange={onDescriptionChange}
          onKeyDown={onKeyDown}
        />
      </div>
      <div className="flex justify-end">
        <PrimaryButton
          disabled={title.trim().length === 0 || loading}
          onClick={onSubmit}
        >
          {loading ? <LoadingSpinner /> : 'Ask away'}
        </PrimaryButton>
      </div>
      {error && <ErrorAlert>{error}</ErrorAlert>}
    </form>
  )
}
