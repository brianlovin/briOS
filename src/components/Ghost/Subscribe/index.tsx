import * as React from 'react'
import { Input } from '~/components/Input'

export default function OverthoughtSubscribeBox() {
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
      className="flex flex-col p-4 space-y-3 bg-gray-100 rounded-lg dark:bg-gray-900"
      data-cy="overthought-subscribe-box"
    >
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
            <polyline points="12 16 16 12 12 8"></polyline>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </span>
        Follow along
      </h5>
      <p>
        If you want to know about new posts, add your email below.
        Alternatively, you can{' '}
        <a
          href="https://paulsmessage.com/rss/"
          target="_blank"
          rel="noopener noreferrer"
        >
          subscribe with RSS
        </a>
        .
      </p>
      {status === 'succeeded' ? (
        <p className="p-3 text-center text-white bg-green-500 rounded">
          Thanks for subscribing!
        </p>
      ) : (
        <form
          onSubmit={submit}
          className="flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0"
        >
          <label className="flex flex-1">
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
          <button
            className="btn btn-primary"
            onClick={submit}
            disabled={status === 'submitting' || !email}
            type="submit"
          >
            Subscribe
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="p-3 text-center text-white bg-red-500 rounded">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
