// @flow
import * as React from 'react'
import type { SimplecastEpisode, ConfigPodcast } from '../../types'
import { Link as RouteLink } from '../../config/routes'
import { Grid, Title, Timestamp,Divider, PlayTitleContainer, TextContainer, } from './style'
import { getDateObject } from '../../lib/getDateObject'
import Markdown from '../Markdown'
import EpisodePlayButton from '../EpisodePlayButton'

type Props = {
  episode: SimplecastEpisode,
  podcast: ConfigPodcast
}

type State = {
  audioPlayerVisible: boolean
}

class EpisodePreview extends React.Component<Props, State> {
  render() {
    const { episode, podcast } = this.props
    const { month, year, day } = getDateObject(episode.published_at)
    const datestring = `${month} ${day}, ${year}`

    return (
      <Grid>
        <PlayTitleContainer>
          <EpisodePlayButton episode={episode} size={'mini'} />
          
          <TextContainer>
            <RouteLink route='episode' params={{ slug: podcast.slug, episodeId: episode.id }}>
              <a>
                <Timestamp alt={datestring}>{datestring}</Timestamp>
              </a>
            </RouteLink>
            
            <RouteLink route='episode' params={{ slug: podcast.slug, episodeId: episode.id }}>
              <a>
                <Title>{episode.title}</Title>
              </a>
            </RouteLink>
          </TextContainer>
        </PlayTitleContainer>

        <Markdown>{episode.description}</Markdown>

        <Divider />
      </Grid>
    )
  }
}

export default EpisodePreview