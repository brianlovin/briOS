import * as React from 'react'
import { ErrorAlert, SuccessAlert } from '~/components/Alert'
import Button from '~/components/Button'
import { Input } from '~/components/Input'

export default function WritingSubscribeBox() {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState('pending')
  const [errorMessage, setErrorMessage] = React.useState('')

  function onChange(e) {
    if (status !== 'pending') setStatus('pending')
    return setEmail(e.target.value.trim())
  }

  async function submit(e) {
    e.preventDefault()

    const res = await fetch('/api/newsletter', {
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })

    const { error } = await res.json()

    if (error) {
      setStatus('error')
      setErrorMessage(error)
      return
    }

    setEmail('')
    setStatus('succeeded')
  }

  return (
    <div
      className="flex flex-col p-8 -mx-8 space-y-4 bg-gray-400 border-t border-b border-gray-300 border-dashed bg-opacity-5 dark:border-gray-800"
      data-cy="writing-subscribe-box"
    >
      <div className="flex flex-col space-y-2">
        <p className="flex items-center font-semibold text-primary">
          Subscribe with email
        </p>
        <p className="text-tertiary">
          Get updates about new posts and projects in your inbox. Alternatively,
          you can{' '}
          <a
            href="https://overthought.ghost.io/rss/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-normal bg-purple-600 text-primary bg-opacity-10 hover:bg-opacity-20"
          >
            subscribe with RSS
          </a>
          {' or '}
          <a
            href="https://twitter.com/brian_lovin/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-normal bg-blue-400 text-primary bg-opacity-10 hover:bg-opacity-20"
          >
            follow me on Twitter
          </a>
          .
        </p>
      </div>
      {status === 'succeeded' ? (
        <SuccessAlert>Thanks for subscribing!</SuccessAlert>
      ) : (
        <form
          onSubmit={submit}
          className="grid grid-cols-1 gap-2 mt-2 md:grid-cols-3"
        >
          <label className="col-span-2">
            <span className="sr-only">Email address</span>
            <Input
              value={email}
              disabled={status === 'loading'}
              onChange={onChange}
              placeholder="Email address"
              type="email"
              name="email"
            />
          </label>
          <Button
            onClick={submit}
            disabled={status === 'submitting' || !email}
            type="submit"
          >
            Subscribe
          </Button>
        </form>
      )}
      {status === 'error' && <ErrorAlert>{errorMessage}</ErrorAlert>}
    </div>
  )
}
