// @flow
import * as React from 'react'
import type { SimplecastEpisode } from '../../types'
import { podcasts, api } from '../../config'
import { getDateObject } from '../../lib/getDateObject'
import EpisodePlayButton from '../EpisodePlayButton'
import {
  Card,
  Artwork,
  ContentContainer,
  Date,
  Title,
  Actions,
  AllEpsButton,
} from './style'

type State = {
  episodes: ?Array<?SimplecastEpisode>,
  isLoading: boolean,
  error: boolean,
}

class DesignDetailsPlayer extends React.Component<{}, State> {
  state = { episodes: [], isLoading: true, error: false }
  
  componentDidMount = async () => {
    const episodes = await api.getEpisodes(podcasts[0].id)
    return this.setState({
      episodes: episodes ? episodes : [],
      isLoading: false,
      error: episodes ? false : true
    }) 
  }

  render() {
    const { episodes, isLoading, error } = this.state
    const episode = episodes && episodes.length > 0
      ? episodes.filter(ep => ep && ep.published)[0]
      : null

    if (error) return null  

    if (episode) {
      const { month, year, day } = getDateObject(episode.published_at)
      const datestring = `${month} ${day}, ${year}`
      
      return (
        <Card>
          <a href="https://spec.fm/podcasts/design-details" target="_blank" rel="noopener noreferrer">
            <Artwork src={'/static/img/podcasts/designdetails.jpg'} />
          </a>
  
          <ContentContainer>
            <Date>{datestring}</Date>
            <Title>{episode.title}</Title>
            <Actions>
              <EpisodePlayButton episode={episode} />
              <a href="https://spec.fm/podcasts/design-details" target="_blank" rel="noopener noreferrer">
                <AllEpsButton>All Episodes</AllEpsButton>
              </a>
            </Actions>
          </ContentContainer>
        </Card>
      )
    }

    return null
  }
}

export default DesignDetailsPlayer