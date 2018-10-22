// @flow
import * as React from 'react'
import { designDetails } from '../../config' 
import DesignDetailsCard from '../DesignDetailsCard'

type Props = {
  truncated: boolean
}

class DesignDetailsGrid extends React.Component<Props> {
  render() {
    const { truncated } = this.props
    const posts = truncated ? designDetails.slice(0, 4) : designDetails
    return posts.map(post => (
      <DesignDetailsCard key={post.slug} post={post} />
    ))
  }
}

export default DesignDetailsGrid