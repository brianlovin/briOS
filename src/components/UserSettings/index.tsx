import * as React from 'react'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { useGetViewerWithSettingsQuery } from '~/graphql/types.generated'

import { EmailForm } from './Email'
import { EmailPreferences } from './EmailPreferences'
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

        <div className="divide-y divide-gray-200 py-12 dark:divide-gray-800">
          <div className="space-y-8 py-12">
            <h3 className="text-primary text-lg font-bold">Account</h3>
            <EmailForm viewer={data.viewer} />
            <UsernameForm viewer={data.viewer} />
          </div>

          {data.viewer.email && (
            <div className="space-y-8 py-12">
              <h3 className="text-primary text-lg font-bold">Emails</h3>
              <EmailPreferences viewer={data.viewer} />
            </div>
          )}
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
