import * as React from 'react'
import { ErrorAlert, SuccessAlert } from '~/components/Alert'
import Button from '~/components/Button'
import { Input } from '~/components/Input'

export default function NewsletterSubscriptionBox() {
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
    <>
      {status === 'succeeded' ? (
        <SuccessAlert>Thanks for subscribing!</SuccessAlert>
      ) : (
        <form
          onSubmit={submit}
          className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-3"
        >
          <label className="md:col-span-2">
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
            className="w-full"
          >
            Subscribe
          </Button>
        </form>
      )}
      {status === 'error' && <ErrorAlert>{errorMessage}</ErrorAlert>}
    </>
  )
}
