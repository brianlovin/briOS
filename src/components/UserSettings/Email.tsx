import * as React from 'react'

import { WarnAlert } from '~/components/Alert'
import Button from '~/components/Button'
import { Input } from '~/components/Input'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import { GET_VIEWER_SETTINGS } from '~/graphql/queries/viewer'
import {
  GetViewerWithSettingsQuery,
  useEditUserMutation,
} from '~/graphql/types.generated'

export function EmailForm(props: {
  viewer: GetViewerWithSettingsQuery['viewer']
}) {
  const { viewer } = props
  const isNew = !viewer.email && !viewer.pendingEmail

  const [isEditing, setIsEditing] = React.useState(isNew)
  const [email, setEmail] = React.useState('')

  const [setPendingEmail, setPendingEmailResponse] = useEditUserMutation({
    variables: {
      data: {
        email,
      },
    },
    update(cache) {
      // @ts-ignore
      const { viewer } = cache.readQuery({
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
      const { viewer } = cache.readQuery<GetViewerWithSettingsQuery>({
        query: GET_VIEWER_SETTINGS,
      })

      cache.writeQuery({
        query: GET_VIEWER_SETTINGS,
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
        email: viewer.pendingEmail,
      },
    },
    update(cache) {
      const { viewer } = cache.readQuery<GetViewerWithSettingsQuery>({
        query: GET_VIEWER_SETTINGS,
      })

      cache.writeQuery({
        query: GET_VIEWER_SETTINGS,
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
    setEmail(e.target.value.trim())
  }

  return (
    <div className="space-y-2">
      <p className="font-semibold text-primary">Email</p>

      {viewer.email && (
        <div className="flex space-x-2 text-primary">
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
          {isNew && (
            <p className="text-sm text-quaternary">
              Adding your email will allow you to turn on replies for comments
              or AMA questions.
            </p>
          )}
          <Input
            type="email"
            placeholder={
              isNew ? 'Add your email address' : 'Update your email address'
            }
            value={email}
            autoFocus
            onChange={handleEmailChange}
          />
          <div className="flex justify-between">
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
                Check <span className="font-medium">{viewer.pendingEmail}</span>{' '}
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
