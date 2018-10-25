// @flow
import * as React from 'react'
import { designDetails } from '../../config' 
import DesignDetailsCard from '../DesignDetailsCard'
import { Grid } from './style'

type Props = {
  truncated: boolean
}

class DesignDetailsGrid extends React.Component<Props> {
  render() {
    const { truncated } = this.props
    const posts = truncated ? designDetails.slice(0, 4) : designDetails

    return (
      <Grid>
      {
        posts.map(post => (
          <DesignDetailsCard key={post.slug} post={post} />
        ))
      }
      </Grid>
    )
  }
}

export default DesignDetailsGrid