import * as React from 'react'
import DesignDetailsCard from '~/components/DesignDetailsCard'
import { DesignDetailsPostSummary } from '~/data/appDissections'
import Flex from '~/components/Flex'

interface Props {
  summaries: DesignDetailsPostSummary[]
}

export default function DesignDetailsGrid({ summaries }: Props) {
  return (
    <Flex flexDirection="column" gap={16}>
      {summaries.map((summary) => (
        <DesignDetailsCard key={summary.slug} summary={summary} />
      ))}
    </Flex>
  )
}
