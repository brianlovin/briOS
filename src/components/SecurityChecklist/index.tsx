// @flow
import React from 'react'
import data from '~/data/security'
import ChecklistItem from './ChecklistItem'

export default function SecurityChecklist() {
  const keys = Object.keys(data)
  const resources = keys.map((k) => data[k])
  return (
    <div className="flex flex-col mt-8 space-y-4 md:space-y-8">
      {resources.map((resource) => (
        <ChecklistItem key={resource.id} resource={resource} />
      ))}
    </div>
  )
}
