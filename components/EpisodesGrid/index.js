// @flow
import * as React from 'react'
import type { SimplecastEpisode, ConfigPodcast } from '../../types'
import EpisodePreview from '../EpisodePreview'
import { Grid } from './style'
import { Button } from '../Button'

type Props = {
  episodes: ?Array<SimplecastEpisode>,
  podcast: ConfigPodcast
}

type State = {
  hasExpanded: boolean
}

class EpisodesGrid extends React.Component<Props, State> {
  state = { hasExpanded: false }

  expand = () => this.setState({ hasExpanded: true })
  
  render() {
    const { episodes: allEpisodes, podcast } = this.props
    const { hasExpanded } = this.state

    if (!allEpisodes) return null

    let episodes = hasExpanded ? allEpisodes : allEpisodes.slice(0, 5)

    return (
      <Grid>
        {
          episodes.filter(episode => episode.published).map(episode => {
            return <EpisodePreview podcast={podcast} episode={episode} key={episode.id} />
          })
        }

        <Button style={{marginBottom: '64px'}} size={'large'} onClick={this.expand}>View All Episodes</Button>
      </Grid>
    )
  }
}

export default EpisodesGrid