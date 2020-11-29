import * as React from 'react'
import { Post } from '~/graphql/types.generated'
import { Input, Textarea } from '~/components/Input'

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
    <div className="flex flex-col p-4 space-y-2 bg-gray-100 rounded-lg dark:bg-gray-900">
      <h5 className="flex items-center">
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            paddingRight: '16px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </span>
        A small favor
      </h5>
      <p>
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
            />
          </label>
          <label>
            <span className="sr-only">(Optional) Twitter handle</span>

            <Input
              id="twitter"
              name="twitter"
              placeholder="(Optional) Twitter handle"
            />
          </label>
        </div>
        <div className="flex justify-end">
          <button
            className="btn btn-primary"
            disabled={serverState.submitting || !message}
            type="submit"
          >
            Send feedback
          </button>
        </div>
        {serverState.submitted &&
          (serverState.error ? (
            <p className="p-3 text-white bg-red-500 rounded">
              {serverState.error}
            </p>
          ) : (
            <p className="p-3 text-center text-white bg-green-500 rounded">
              Thanks for taking the time to leave a note!
            </p>
          ))}
      </form>
    </div>
  )
}
