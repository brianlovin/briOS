import * as React from 'react'
import { useAddAmaQuestionMutation } from '~/graphql/types.generated'
import { Textarea } from '~/components/Input'
import { ErrorAlert, SuccessAlert } from '../Alert'
import Button from '../Button'
import toast from 'react-hot-toast'

export function AddQuestionForm({ closeModal }) {
  const [text, setText] = React.useState('')
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState(false)

  const [handleAddAMAQuestion] = useAddAmaQuestionMutation({
    onCompleted: () => {
      setText('')
      setSuccess(true)
      toast.success('Saved!')
      return closeModal()
    },
    onError({ message }) {
      const clean = message.replace('GraphQL error:', '')
      setError(clean)
      setText('')
    },
  })

  function onSubmit(e) {
    e.preventDefault()
    setSuccess(false)
    if (text.length === 0) {
      setError('Question can’t be blank')
      return
    }

    return handleAddAMAQuestion({ variables: { text } })
  }

  function onTextChange(e) {
    error && setError('')
    return setText(e.target.value)
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && e.metaKey) {
      return onSubmit(e)
    }
  }

  return (
    <form className="items-stretch p-4 space-y-4" onSubmit={onSubmit}>
      <Textarea
        rows={4}
        value={text}
        placeholder="Ask me anything..."
        onChange={onTextChange}
        onKeyDown={onKeyDown}
      />
      <div className="flex justify-end">
        <Button onClick={onSubmit}>Ask</Button>
      </div>
      {error && <ErrorAlert>{error}</ErrorAlert>}
      {success && (
        <SuccessAlert>
          Thanks for asking! I’ll reply soon, so feel free to check back 👋
        </SuccessAlert>
      )}
    </form>
  )
}
