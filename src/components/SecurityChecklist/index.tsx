import React from 'react'
import routes from '~/config/routes'
import data from '~/data/security'
import { Detail } from '../ListDetail/Detail'
import TitleBar from '../ListDetail/TitleBar'
import ChecklistItem from './ChecklistItem'

export default function SecurityChecklist() {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  const keys = Object.keys(data)
  const resources = keys.map((k) => data[k])
  return (
    <Detail.Container ref={scrollContainerRef}>
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
          <p className="text-xl text-tertiary">
            {routes.security.seo.description}
          </p>
        </Detail.Header>

        <div className="space-y-24">
          {resources.map((resource) => (
            <ChecklistItem key={resource.id} resource={resource} />
          ))}
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
