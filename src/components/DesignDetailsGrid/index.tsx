import * as React from 'react'
import DesignDetailsCard from '~/components/DesignDetailsCard'
import Grid from '~/components/Grid'
import { DesignDetailsPostSummary } from '~/data/appDissections'

interface Props {
  summaries: DesignDetailsPostSummary[]
}

export default function DesignDetailsGrid({ summaries }: Props) {
  return (
    <Grid gap={16}>
      {summaries.map((summary) => (
        <DesignDetailsCard key={summary.slug} summary={summary} />
      ))}
    </Grid>
  )
}
