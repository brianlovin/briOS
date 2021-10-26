import * as React from 'react'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { useGetViewerWithSettingsQuery } from '~/graphql/types.generated'

import { EmailForm } from './Email'
import { EmailPreferences } from './EmailPreferences'
import { UserSettingsFooter } from './Footer'
import { SignedOut } from './SignedOut'
import { UsernameForm } from './Username'

export function UserSettings() {
  const { data, loading } = useGetViewerWithSettingsQuery({
    fetchPolicy: 'network-only',
  })

  const titleRef = React.useRef(null)
  const scrollContainerRef = React.useRef(null)

  if (!data?.viewer && loading) {
    return <Detail.Loading />
  }

  if (!data?.viewer) {
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

        <div className="py-12 divide-y divide-gray-200 dark:divide-gray-800">
          <div className="py-12 space-y-8">
            <h3 className="text-lg font-bold text-primary">Account</h3>
            <EmailForm />
            <UsernameForm />
          </div>

          {data.viewer.email && (
            <div className="py-12 space-y-8">
              <h3 className="text-lg font-bold text-primary">Emails</h3>
              <EmailPreferences />
            </div>
          )}

          <UserSettingsFooter />
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}