import * as React from 'react'

import { ErrorAlert, SuccessAlert } from '~/components/Alert'
import { PrimaryButton } from '~/components/Button'
import { Input } from '~/components/Input'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import { validEmail } from '~/lib/validators'

export function WritingSubscriptionForm({ defaultValue = '' }) {
  const [email, setEmail] = React.useState(defaultValue)
  const [status, setStatus] = React.useState('default')

  function onChange(e) {
    setStatus('default')
    return setEmail(e.target.value.trim())
  }

  async function submit(e) {
    e.preventDefault()
    setStatus('saving')

    if (!validEmail(email)) {
      setStatus('saving')
      return setStatus('invalid-email')
    }

    await fetch(`/api/newsletter`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    }).then((res) => res.json())

    setStatus('success')
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col space-y-4">
        <p className="text-tertiary">
          Get an email whenever I publish new posts. I also publish semi-regular
          newsletters containing links to interesting articles about design,
          technology, and startups.
        </p>
        <form
          data-cy="subscribe-hn-form"
          onSubmit={submit}
          className="grid grid-cols-1 gap-2 mt-2 md:grid-cols-3"
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
          <PrimaryButton
            onClick={submit}
            disabled={status === 'saving' || !email}
            type="submit"
          >
            {status === 'saving' ? <LoadingSpinner /> : 'Subscribe'}
          </PrimaryButton>
        </form>
        <p className="text-sm text-quaternary">
          Unsubscribe at any time. Powered by{' '}
          <a
            href="https://www.getrevue.co/profile/brian_lovin"
            className="text-primary"
          >
            Revue
          </a>
          .
        </p>
        {status === 'invalid-email' && (
          <ErrorAlert>That email doesn’t look valid, try another?</ErrorAlert>
        )}
        {status === 'success' && (
          <SuccessAlert>
            A confirmation email was sent to {email} — go click the link!
          </SuccessAlert>
        )}
      </div>
    </div>
  )
}
