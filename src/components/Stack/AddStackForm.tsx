import * as React from 'react'
import toast from 'react-hot-toast'
import { useAddStackMutation } from '~/graphql/types.generated'
import { Input, Textarea } from '~/components/Input'
import Button from '../Button'
import { ErrorAlert } from '~/components/Alert'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import { useRouter } from 'next/router'
import { GET_STACKS } from '~/graphql/queries/stack'
import { StackImageUploader } from './StackImageUploader'

export function AddStackForm({ closeModal }) {
  const [url, setUrl] = React.useState('')
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [image, setImage] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState('')

  const router = useRouter()

  const query = GET_STACKS

  const [handleAddStack] = useAddStackMutation({
    onCompleted: ({ addStack: { id } }) => {
      closeModal()
      return router.push(`/stack/${id}`)
    },
    update(cache, { data: { addStack } }) {
      const { stacks } = cache.readQuery({
        query,
      })
      cache.writeQuery({
        query,
        data: {
          stacks: [addStack, ...stacks].sort((a, b) =>
            a.name < b.name ? -1 : 1
          ),
        },
      })
    },
    onError({ message }) {
      const clean = message.replace('GraphQL error:', '')
      setError(clean)
      setUrl('')
      setIsSaving(false)
    },
  })

  function onSubmit(e) {
    e.preventDefault()
    setIsSaving(true)
    return handleAddStack({
      variables: { data: { url, name, description, image } },
    })
  }

  function onUrlChange(e) {
    error && setError('')
    return setUrl(e.target.value)
  }

  function onNameChange(e) {
    error && setError('')
    return setName(e.target.value)
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

  function onImageUploaded(url) {
    return setImage(url)
  }

  return (
    <div className="p-4 space-y-3">
      <StackImageUploader stack={null} onImageUploaded={onImageUploaded} />
      <form className="space-y-3" onSubmit={onSubmit}>
        <Input
          type="text"
          placeholder="Add a url..."
          value={url}
          onChange={onUrlChange}
          onKeyDown={onKeyDown}
        />
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={onNameChange}
          onKeyDown={onKeyDown}
        />
        <Textarea
          rows={4}
          placeholder="Description"
          value={description}
          onChange={onDescriptionChange}
          onKeyDown={onKeyDown}
        />
        <div className="flex justify-end">
          <Button disabled={!url || !image} onClick={onSubmit}>
            {isSaving ? <LoadingSpinner /> : 'Save'}
          </Button>
        </div>
        {error && <ErrorAlert>{error}</ErrorAlert>}
      </form>
    </div>
  )
}
