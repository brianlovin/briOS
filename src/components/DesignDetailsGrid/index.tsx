import * as React from 'react'
import DesignDetailsCard from '~/components/DesignDetailsCard'
import { DesignDetailsPostSummary } from '~/data/appDissections'

interface Props {
  summaries: DesignDetailsPostSummary[]
}

export default function DesignDetailsGrid({ summaries }: Props) {
  return (
    <div className="flex flex-col space-y-4">
      {summaries.map((summary) => (
        <DesignDetailsCard key={summary.slug} summary={summary} />
      ))}
    </div>
  )
}
