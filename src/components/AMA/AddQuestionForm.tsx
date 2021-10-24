import * as React from 'react'
import { useAddQuestionMutation } from '~/graphql/types.generated'
import { Textarea } from '~/components/Input'
import { ErrorAlert } from '~/components/Alert'
import { PrimaryButton } from '~/components/Button'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import { useRouter } from 'next/router'

export function AddQuestionForm({ closeModal }) {
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

  return (
    <form className="items-stretch p-4 space-y-4" onSubmit={onSubmit}>
      <Textarea
        rows={2}
        value={title}
        placeholder="Ask me anything..."
        onChange={onTitleChange}
        onKeyDown={onKeyDown}
      />
      <Textarea
        rows={4}
        value={description}
        placeholder="Optional: add a description with more details..."
        onChange={onDescriptionChange}
        onKeyDown={onKeyDown}
      />
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
