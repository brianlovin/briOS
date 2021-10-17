import * as React from 'react'
import { GET_VIEWER_QUERY } from '~/graphql/queries'
import {
  useEditUserMutation,
  useGetViewerWithSettingsQuery,
} from '~/graphql/types.generated'
import { validUsername } from '~/lib/validators'
import Button from '../Button'
import { Input } from '../Input'
import { LoadingSpinner } from '../LoadingSpinner'

export function UsernameForm() {
  const { data } = useGetViewerWithSettingsQuery()
  const { viewer } = data
  const [username, setUsername] = React.useState(data?.viewer?.username || '')
  const [isEditing, setIsEditing] = React.useState(false)
  const [error, setError] = React.useState(null)

  const [editUser, editUserResponse] = useEditUserMutation({
    variables: {
      data: {
        username,
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
            username,
          },
        },
      })
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
    if (!validUsername(e.target.value)) {
      setError(true)
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-primary">Username</p>

      {viewer.username && (
        <div className="flex space-x-2">
          <span>@{viewer.username}</span>
          <span>·</span>
          <button
            className="font-medium text-blue-500 cursor-pointer"
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
              numbers, letters, underscores, or periods.
            </p>
          )}
          <p className="text-xs text-quaternary">
            Updating your username will break any existing links to your
            profile, so you know, don’t do it too often.
          </p>
          <div className="flex justify-between">
            <span />
            <Button type="submit">
              {editUserResponse.loading ? <LoadingSpinner /> : 'Save username'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
