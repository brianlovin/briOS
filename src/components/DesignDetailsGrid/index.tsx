import * as React from 'react'
import designDetailsPosts from '~/data/appDissections'
import DesignDetailsCard from '~/components/DesignDetailsCard'
import Grid from '~/components/Grid'

interface Props {
  truncate: boolean
}

export default function DesignDetailsGrid({ truncate }: Props) {
  const posts = truncate ? designDetailsPosts.slice(0, 4) : designDetailsPosts
  return (
    <Grid gap={16}>
      {posts.map((post) => (
        <DesignDetailsCard key={post.slug} post={post} />
      ))}
    </Grid>
  )
}
