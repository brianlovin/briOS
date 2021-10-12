import React from 'react'
import { Detail } from '~/components/ListDetail/Detail'
import TitleBar from '~/components/ListDetail/TitleBar'
import { useGetUserQuery } from '~/graphql/types.generated'
import Button from '../Button'

export default function UserDetail({ username }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  const { data, loading, error } = useGetUserQuery({ variables: { username } })

  if (loading) return null
  if (error) return null

  if (data?.user) {
    const { user } = data
    return (
      <Detail.Container ref={scrollContainerRef}>
        <TitleBar
          magicTitle
          title={user.name}
          titleRef={titleRef}
          scrollContainerRef={scrollContainerRef}
          trailingAccessory={user.isViewer ? <Button>Settings</Button> : null}
        />

        <Detail.ContentContainer>
          <Detail.Header>
            <Detail.Title ref={titleRef}>{user.name}</Detail.Title>
            <p className="text-xl text-tertiary">@{user.username}</p>
          </Detail.Header>
        </Detail.ContentContainer>
      </Detail.Container>
    )
  }
}
