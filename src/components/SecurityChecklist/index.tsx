import React from 'react'
import routes from '~/config/routes'
import data from '~/data/security'
import TitleBar from '../ListDetail/TitleBar'
import ChecklistItem from './ChecklistItem'

export default function SecurityChecklist() {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)

  const keys = Object.keys(data)
  const resources = keys.map((k) => data[k])
  return (
    <div
      ref={scrollContainerRef}
      className="w-full max-h-screen overflow-y-auto"
    >
      <TitleBar
        magicTitle
        title={'Security Checklist'}
        titleRef={titleRef}
        scrollContainerRef={scrollContainerRef}
      />

      <div className="justify-center py-24">
        <div className="max-w-screen-md px-4 mx-auto space-y-16">
          <div className="space-y-2">
            <h1
              ref={titleRef}
              className="text-2xl font-bold md:text-3xl text-primary"
            >
              {routes.security.seo.title}
            </h1>
            <p className="text-xl text-tertiary">
              {routes.security.seo.description}
            </p>
          </div>

          {resources.map((resource) => (
            <ChecklistItem key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </div>
  )
}
