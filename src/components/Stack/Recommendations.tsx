import * as React from 'react'
import { Input, Textarea } from '~/components/Input'

export default function Recommendations() {
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
    <div className="p-8 -mx-8 space-y-4 bg-gray-400 border-b border-gray-300 border-dashed bg-opacity-5 dark:border-gray-800">
      <p className="flex">Recommendations</p>
      <p className="text-tertiary">
        My stack is a curated list of tools and software that I use daily. In
        general, less is more. But I’m always interested in discovering great
        new apps and tools – let me know what I should check out.
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 space-y-4">
        <input
          type="hidden"
          value={`New stack recommendation`}
          id={'stack'}
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
            placeholder="What should I check out?"
          ></Textarea>
        </label>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label>
            <span className="sr-only">Email</span>

            <Input
              id="feedback-email"
              name="email"
              placeholder="(Optional) Your email"
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
          <button
            className="px-8 py-2 font-medium rounded flex-0 disabled:text-gray-400 bg-gray-1000 dark:bg-white bg-opacity-5 text-primary hover:bg-opacity-10"
            disabled={serverState.submitting || !message}
            type="submit"
          >
            Send feedback
          </button>
        </div>
        {serverState.submitted &&
          (serverState.error ? (
            <p className="p-2 text-center text-red-600 bg-red-500 rounded bg-opacity-5">
              {serverState.error}
            </p>
          ) : (
            <p className="p-2 text-center text-green-700 bg-green-500 rounded bg-opacity-5">
              Thanks for the recommendation!
            </p>
          ))}
      </form>
    </div>
  )
}
