import * as React from 'react'
import { Input } from '~/components/Input'
import { ErrorAlert, SuccessAlert } from '../Alert'
import Button from '../Button'

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
      className="p-8 -mx-8 space-y-4 bg-gray-400 border-t border-b border-gray-300 border-dashed dark:bg-gray-200 bg-opacity-5 dark:border-gray-800"
      data-cy="hn-subscribe-box"
    >
      <p className="font-semibold text-primary">Daily digest email</p>
      <p className="text-tertiary">
        Get a daily email with the the top stories from Hacker News. No spam,
        unsubscribe at any time.
      </p>
      {status === 'succeeded' ? (
        <SuccessAlert>Subscribed!</SuccessAlert>
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
