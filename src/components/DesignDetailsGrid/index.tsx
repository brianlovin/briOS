import * as React from 'react'
import DesignDetailsCard from '~/components/DesignDetailsCard'
import { DesignDetailsPostSummary } from '~/data/appDissections'

interface Props {
  summaries: DesignDetailsPostSummary[]
}

export default function DesignDetailsGrid({ summaries }: Props) {
  return (
    <>
      {summaries.map((summary) => (
        <DesignDetailsCard key={summary.slug} summary={summary} />
      ))}
    </>
  )
}
