import * as React from 'react'

import { ErrorAlert, SuccessAlert } from '~/components/Alert'
import { PrimaryButton } from '~/components/Button'
import { Input } from '~/components/Input'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import { EmailSubscriptionForm } from '~/components/UserSettings/EmailPreferences'
import { GET_VIEWER_SETTINGS } from '~/graphql/queries/viewer'
import {
  EmailSubscriptionType,
  GetViewerWithSettingsQuery,
  useEditEmailSubscriptionMutation,
  useEditUserMutation,
  useGetViewerWithSettingsQuery,
} from '~/graphql/types.generated'
import { validEmail } from '~/lib/validators'

export function HackerNewsSubscriptionForm() {
  const { data, loading } = useGetViewerWithSettingsQuery({
    fetchPolicy: 'cache-and-network',
  })
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState('default')

  function onChange(e) {
    setStatus('default')
    return setEmail(e.target.value.trim())
  }

  const [editEmailSubscription, { loading: saving }] =
    useEditEmailSubscriptionMutation({
      onCompleted() {
        setStatus('success')
        setEmail('')
      },
    })

  const [setPendingEmail, setPendingEmailResponse] = useEditUserMutation({
    update(cache) {
      const { viewer } = cache.readQuery<GetViewerWithSettingsQuery>({
        query: GET_VIEWER_SETTINGS,
      })

      cache.writeQuery({
        query: GET_VIEWER_SETTINGS,
        data: {
          viewer: {
            ...viewer,
            pendingEmail: email === viewer.email ? null : email,
          },
        },
      })
    },
    onError() {},
  })

  async function submit(e) {
    e.preventDefault()

    if (!validEmail(email)) {
      return setStatus('invalid-email')
    }

    if (data.viewer && !data.viewer.email) {
      setPendingEmail({
        variables: {
          data: {
            email,
          },
        },
      })
    }

    editEmailSubscription({
      variables: {
        data: {
          type: EmailSubscriptionType.HackerNews,
          subscribed: true,
          email: email,
        },
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (!data.viewer || !data.viewer.email) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex flex-col space-y-4">
          <p className="text-secondary">
            Get a daily email with the the top stories from Hacker News. No
            spam, unsubscribe at any time.
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
              disabled={saving || !email}
              type="submit"
            >
              {saving ? <LoadingSpinner /> : 'Subscribe'}
            </PrimaryButton>
          </form>
          {status === 'invalid-email' && (
            <ErrorAlert>That email doesn’t look valid.</ErrorAlert>
          )}
          {status === 'success' && (
            <SuccessAlert>
              Subscribed! Catch you in the next digest.
            </SuccessAlert>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <EmailSubscriptionForm
        subscription={data.viewer.emailSubscriptions.find(
          (s) => s.type === EmailSubscriptionType.HackerNews
        )}
      />
    </div>
  )
}
