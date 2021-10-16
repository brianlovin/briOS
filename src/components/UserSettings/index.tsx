import * as React from 'react'
import { useViewerQuery } from '~/graphql/types.generated'
import { Detail } from '../ListDetail/Detail'
import TitleBar from '../ListDetail/TitleBar'
import { LoadingSpinner } from '../LoadingSpinner'
import { EmailForm } from './Email'
import { UserSettingsFooter } from './Footer'
import { SignedOut } from './SignedOut'
import { UsernameForm } from './Username'

export function UserSettings() {
  const { data, loading } = useViewerQuery()
  const titleRef = React.useRef(null)
  const scrollContainerRef = React.useRef(null)

  if (loading) {
    return (
      <Detail.Container>
        <div className="flex flex-col items-center justify-center flex-1">
          <LoadingSpinner />
        </div>
      </Detail.Container>
    )
  }

  if (!data.viewer) {
    return <SignedOut />
  }

  return (
    <Detail.Container ref={scrollContainerRef}>
      <TitleBar
        magicTitle
        title={'Settings'}
        titleRef={titleRef}
        scrollContainerRef={scrollContainerRef}
      />
      <Detail.ContentContainer>
        <Detail.Header>
          <Detail.Title ref={titleRef}>Settings</Detail.Title>
        </Detail.Header>

        <div className="py-16 space-y-8">
          <EmailForm />
          <UsernameForm />
        </div>

        <UserSettingsFooter />
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
