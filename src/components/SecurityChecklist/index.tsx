// @flow
import React from 'react'
import data from '~/data/security'
import ChecklistItem from './ChecklistItem'

export default function SecurityChecklist() {
  const keys = Object.keys(data)
  const resources = keys.map((k) => data[k])
  return (
    <div className="space-y-16">
      {resources.map((resource) => (
        <ChecklistItem key={resource.id} resource={resource} />
      ))}
    </div>
  )
}
