// @flow
import * as React from 'react'
import { Container, Grid } from './style'
import PodcastCard from '../PodcastCard'
import type { ConfigPodcast } from '../../types'

type Props = {
  podcasts: Array<ConfigPodcast>
}

class PodcastsGrid extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    const curr = this.props
    if (curr.podcasts !== nextProps.podcasts) return true
    return false
  }
  render() {
    const { podcasts } = this.props
    return (
      <Container>
        <Grid>
          {
            podcasts.map(podcast => {
              if (!podcast) return null
              return <PodcastCard key={podcast.id} podcast={podcast} />
            })
          }
        </Grid>
      </Container>
    )
  }
}

export default PodcastsGrid