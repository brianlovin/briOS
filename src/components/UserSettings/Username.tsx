import * as React from 'react'

import Button from '~/components/Button'
import { Input } from '~/components/Input'
import { LoadingSpinner } from '~/components/LoadingSpinner'
import {
  GetViewerWithSettingsQuery,
  useEditUserMutation,
} from '~/graphql/types.generated'
import { validUsername } from '~/lib/validators'

export function UsernameForm(props: {
  viewer: GetViewerWithSettingsQuery['viewer']
}) {
  const { viewer } = props
  const [username, setUsername] = React.useState('')
  const [isEditing, setIsEditing] = React.useState(false)
  const [error, setError] = React.useState(null)

  const [editUser, editUserResponse] = useEditUserMutation({
    variables: {
      data: {
        username,
      },
    },
    onError() {},
    onCompleted() {
      setIsEditing(false)
    },
  })

  function onSubmit(e) {
    e.preventDefault()
    if (editUserResponse.loading) return
    if (username === viewer.username) return setIsEditing(false)
    if (!validUsername(username)) return setError(true)
    editUser()
  }

  function handleUsernameChange(e) {
    setError(false)
    setUsername(e.target.value)
  }

  return (
    <div className="space-y-2">
      <p className="text-primary font-semibold">Username</p>

      {viewer.username && (
        <div className="text-primary flex space-x-2">
          <span>@{viewer.username}</span>
          <span>·</span>
          <button
            className="cursor-pointer font-medium text-blue-500"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      )}

      {isEditing && (
        <form className="space-y-2" onSubmit={onSubmit}>
          <Input
            type="text"
            placeholder={'Choose a username'}
            value={username}
            autoFocus
            onChange={handleUsernameChange}
          />
          {error && (
            <p className={`text-xs text-red-500`}>
              Usernames should be between 4 and 16 characters and only have
              numbers, letters, or underscores.
            </p>
          )}
          <p className="text-quaternary text-xs">
            Updating your username will break any existing links to your
            profile, so you know, don’t do it too often.
          </p>
          <div className="flex justify-between">
            <Button type="submit">
              {editUserResponse.loading ? <LoadingSpinner /> : 'Save username'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
