import * as React from 'react'
import { useAddAmaQuestionMutation } from '~/graphql/types.generated'
import { Small } from '~/components/Typography'
import Textarea from '../Textarea'
import { PrimaryButton } from '../Button'
import Flex from '../Flex'

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
    <Flex flexDirection="column" gap={12} as={'form'} onSubmit={onSubmit}>
      <Textarea
        value={question}
        placeholder="Ask me anything..."
        onChange={onQuestionChange}
        onKeyDown={onKeyDown}
      />
      {question.length > 0 && (
        <PrimaryButton onClick={onSubmit}>Ask away!</PrimaryButton>
      )}
      {error && <Small style={{ color: 'var(--accent-red)' }}>{error}</Small>}
      {success && (
        <Small style={{ color: 'var(--accent-green)' }}>
          Thanks for asking! I’ll reply soon, so feel free to check back 👋
        </Small>
      )}
    </Flex>
  )
}
