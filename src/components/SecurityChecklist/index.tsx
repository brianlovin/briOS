import React from 'react'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import routes from '~/config/routes'
import data from '~/data/security'

import { ChecklistItem } from './ChecklistItem'

export function SecurityChecklist() {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  const keys = Object.keys(data)
  const resources = keys.map((k) => data[k])
  return (
    <Detail.Container data-cy="security-checklist" ref={scrollContainerRef}>
      <TitleBar
        magicTitle
        title={'Security Checklist'}
        titleRef={titleRef}
        scrollContainerRef={scrollContainerRef}
      />

      <Detail.ContentContainer>
        <Detail.Header>
          <Detail.Title ref={titleRef}>
            {routes.security.seo.title}
          </Detail.Title>
          <p className="text-tertiary text-xl">
            {routes.security.seo.description}
          </p>
        </Detail.Header>

        <div className="space-y-24 pt-16">
          {resources.map((resource) => (
            <ChecklistItem key={resource.id} resource={resource} />
          ))}
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
