import Image from 'next/image'
import * as React from 'react'

import { ListItem } from '~/components/ListDetail/ListItem'
import { DesignDetailsPostSummary } from '~/data/appDissections'

interface Props {
  summary: DesignDetailsPostSummary
  active: boolean
}

export const AppDissectionListItem = React.memo<Props>(
  ({ summary, active }) => {
    return (
      <ListItem
        key={summary.slug}
        href="/app-dissection/[slug]"
        as={`/app-dissection/${summary.slug}`}
        title={summary.title}
        description={null}
        leadingAccessory={
          <Image
            width={48}
            height={48}
            layout="fixed"
            alt={summary.title}
            className={'rounded-xl'}
            src={`/static/img/app-dissection/${summary.slug}.jpeg`}
          />
        }
        byline={`${summary.detailsCount} details`}
        active={active}
      />
    )
  }
)
