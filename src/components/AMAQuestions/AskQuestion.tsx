import * as React from 'react'
import { useAddAmaQuestionMutation } from '~/graphql/types.generated'
import Textarea from '../Textarea'
import { PrimaryButton } from '../Button'

export default function AddBookmark() {
  const [question, setQuestion] = React.useState('')
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState(false)

  const [handleAddAMAQuestion] = useAddAmaQuestionMutation({
    onCompleted: () => {
      setQuestion('')
      setSuccess(true)
    },
    onError({ message }) {
      const clean = message.replace('GraphQL error:', '')
      setError(clean)
      setQuestion('')
    },
  })

  function onSubmit(e) {
    e.preventDefault()
    setSuccess(false)
    return handleAddAMAQuestion({ variables: { question } })
  }

  function onQuestionChange(e) {
    error && setError('')
    return setQuestion(e.target.value)
  }

  function onKeyDown(e) {
    if (e.keyCode === 13 && e.metaKey) {
      return onSubmit(e)
    }
  }

  return (
    <form className="flex flex-col space-y-4 items-stretch" onSubmit={onSubmit}>
      <Textarea
        value={question}
        placeholder="Ask me anything..."
        onChange={onQuestionChange}
        onKeyDown={onKeyDown}
      />
      {question.length > 0 && (
        <div className="flex self-end">
          <PrimaryButton onClick={onSubmit}>Ask away!</PrimaryButton>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <p className="text-green-500">
          Thanks for asking! I’ll reply soon, so feel free to check back 👋
        </p>
      )}
    </form>
  )
}
