import * as React from 'react'
import { GET_VIEWER_QUERY } from '~/graphql/queries'
import { useEditUserMutation, useViewerQuery } from '~/graphql/types.generated'
import { WarnAlert } from '../Alert'
import Button from '../Button'
import { Input } from '../Input'
import { LoadingSpinner } from '../LoadingSpinner'

export function EmailForm() {
  const { data } = useViewerQuery()
  const { viewer } = data
  const isNew = !viewer.email && !viewer.pendingEmail

  const [isEditing, setIsEditing] = React.useState(isNew)
  const [email, setEmail] = React.useState(data?.viewer?.email || '')

  const [setPendingEmail, setPendingEmailResponse] = useEditUserMutation({
    variables: {
      data: {
        email,
      },
    },
    update(cache) {
      const { viewer } = cache.readQuery({
        query: GET_VIEWER_QUERY,
      })

      cache.writeQuery({
        query: GET_VIEWER_QUERY,
        data: {
          viewer: {
            ...viewer,
            pendingEmail: email === viewer.email ? null : email,
          },
        },
      })
    },
    onError() {},
    onCompleted() {
      setIsEditing(false)
    },
  })

  const [cancelPendingEmail, cancelPendingEmailResponse] = useEditUserMutation({
    variables: {
      data: {
        email: null,
      },
    },
    update(cache) {
      const { viewer } = cache.readQuery({
        query: GET_VIEWER_QUERY,
      })

      cache.writeQuery({
        query: GET_VIEWER_QUERY,
        data: {
          viewer: {
            ...viewer,
            pendingEmail: null,
          },
        },
      })
    },
    onError() {},
    onCompleted() {
      setEmail('')
    },
  })

  const [resendPendingEmail, resendPendingEmailResponse] = useEditUserMutation({
    variables: {
      data: {
        email,
      },
    },
    update(cache) {
      const { viewer } = cache.readQuery({
        query: GET_VIEWER_QUERY,
      })

      cache.writeQuery({
        query: GET_VIEWER_QUERY,
        data: {
          viewer,
        },
      })
    },
    onError() {},
  })

  function onSubmit(e) {
    e.preventDefault()
    if (setPendingEmailResponse.loading) return

    if (email === viewer.email) {
      return setIsEditing(false)
    }

    setPendingEmail()
  }

  function handleEmailChange(e) {
    setEmail(e.target.value)
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-primary">Email</p>

      {viewer.email && (
        <div className="flex space-x-2">
          <span>{viewer.email}</span>
          <span>·</span>
          <button
            className="font-medium text-blue-500 cursor-pointer"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      )}

      {(isNew || isEditing) && (
        <form className="space-y-2" onSubmit={onSubmit}>
          <Input
            type="email"
            placeholder={
              isNew ? 'Add your email address' : 'Update your email address'
            }
            value={email}
            autoFocus
            onChange={handleEmailChange}
          />
          {isNew && (
            <p className="pb-2 text-xs text-quaternary">
              Adding your email will allow you to turn on replies for comments
              or AMA questions.
            </p>
          )}
          <div className="flex justify-between">
            <span />
            <Button type="submit">
              {setPendingEmailResponse.loading ? (
                <LoadingSpinner />
              ) : (
                'Save email'
              )}
            </Button>
          </div>
        </form>
      )}

      {viewer.pendingEmail && !isEditing && (
        <>
          <WarnAlert>
            <div className="flex flex-col space-y-2">
              <div>
                Check{' '}
                <span className="font-medium">{data.viewer.pendingEmail}</span>{' '}
                to confirm your email address
              </div>
              <div className="flex space-x-2">
                <Button onClick={cancelPendingEmail}>
                  {cancelPendingEmailResponse.loading ? (
                    <LoadingSpinner />
                  ) : (
                    'Cancel request'
                  )}
                </Button>
                <Button onClick={resendPendingEmail} type="submit">
                  {resendPendingEmailResponse.loading ? (
                    <LoadingSpinner />
                  ) : (
                    'Resend confirmation'
                  )}
                </Button>
              </div>
            </div>
          </WarnAlert>
        </>
      )}
    </div>
  )
}
