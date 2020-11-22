import * as React from 'react'
import { PrimaryButton } from '~/components/Button'
import { Input } from '~/components/Input'

export default function HNSubscribeBox() {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState('pending')
  const [errorMessage, setErrorMessage] = React.useState('')

  function onChange(e) {
    if (status !== 'pending') setStatus('pending')
    return setEmail(e.target.value.trim())
  }

  async function submit(e) {
    e.preventDefault()

    const res = await fetch('/api/hn/subscribe', {
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
      className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg flex flex-col space-y-4"
      data-cy="hn-subscribe-box"
    >
      <h5 className="flex items-center m-0">
        <span className="flex items-center pr-4">
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
        Daily Digest
      </h5>
      <p>
        Get a daily email with the the top stories from Hacker News. No spam,
        unsubscribe at any time.
      </p>
      {status === 'succeeded' ? (
        <p className="text-green-500">Subscribed!</p>
      ) : (
        <form className="flex space-x-3" onSubmit={submit}>
          <Input
            value={email}
            disabled={status === 'loading'}
            onChange={onChange}
            placeholder="Email address"
            id="subscribe-email"
            type="email"
            name="email"
          />
          <PrimaryButton
            disabled={status === 'submitting' || !email}
            type="submit"
          >
            Subscribe
          </PrimaryButton>
        </form>
      )}
      {status === 'error' && <p className="text-red-500">{errorMessage}</p>}
    </div>
  )
}
