import * as React from 'react'
import { Post } from '~/graphql/types.generated'
import { Input, Textarea } from '~/components/Input'
import Button from '~/components/Button'
import { ErrorAlert, SuccessAlert } from '~/components/Alert'

interface Props {
  post: Post
}

export default function Feedback({ post }: Props) {
  const [message, setMessage] = React.useState('')

  const [serverState, setServerState] = React.useState({
    submitting: false,
    submitted: false,
    error: false,
  })

  function onChange(e) {
    setMessage(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    setServerState({ submitting: true, submitted: false, error: false })

    fetch('https://formspree.io/xqkeqvkq', {
      method: 'POST',
      body: new FormData(form),
      headers: {
        Accept: 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        setServerState({
          submitting: false,
          submitted: true,
          error: false,
        })
        form.reset()
        setMessage('')
      } else {
        response.json().then((data) => {
          setServerState({
            submitting: false,
            submitted: true,
            error: data.error,
          })
        })
      }
    })
  }

  return (
    <div
      className="p-8 -mx-8 space-y-4 bg-gray-400 border-t border-gray-300 border-dashed dark:bg-gray-200 bg-opacity-5 dark:border-gray-800"
      data-cy="writing-subscribe-box"
    >
      <p className="font-semibold text-primary">A small favor</p>
      <p className="text-tertiary">
        Was anything I wrote confusing, outdated, or incorrect? Please let me
        know! Just write a few words below and I’ll be sure to amend this post
        with your suggestions.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 space-y-4">
        <input
          type="hidden"
          value={`New comment on ${post.title}`}
          id={post.title}
          name="_subject"
          readOnly
        />
        <label>
          <span className="sr-only">Message</span>
          <Textarea
            onChange={onChange}
            value={message}
            id="message"
            name="message"
            placeholder="What should I know?"
          ></Textarea>
        </label>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label>
            <span className="sr-only">Email</span>

            <Input
              id="feedback-email"
              name="email"
              placeholder="(Optional) Email"
              type="email"
            />
          </label>
          <label>
            <span className="sr-only">(Optional) Twitter handle</span>

            <Input
              id="twitter"
              name="twitter"
              placeholder="(Optional) Twitter handle"
              type="text"
            />
          </label>
        </div>
        <div className="flex justify-end">
          <Button disabled={serverState.submitting || !message} type="submit">
            Send feedback
          </Button>
        </div>
        {serverState.submitted &&
          (serverState.error ? (
            <ErrorAlert>{serverState.error}</ErrorAlert>
          ) : (
            <SuccessAlert>
              Thanks for taking the time to leave a note!
            </SuccessAlert>
          ))}
      </form>
    </div>
  )
}
