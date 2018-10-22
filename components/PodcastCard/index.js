// @flow
import * as React from 'react'
import { Link as RouteLink } from '../../config/routes'
import type { ConfigPodcast } from '../../types'
import PodcastArt from '../PodcastArt';

type Props = {
  podcast: ConfigPodcast
}

export default class PodcastCard extends React.Component<Props> {
  render() {
    const { podcast } = this.props

    if (podcast.slug === 'layout') {
      return (
        <a href={"https://layout.fm"} target={"_blank"} rel={"noopener noreferrer"}>
          <PodcastArt src={podcast.artworkUrl} alt={podcast.name} />
        </a>
      )
    }

    return (
      <RouteLink key={podcast.id} route='podcast' params={{ slug: podcast.slug }}>
        <a>
          <PodcastArt src={podcast.artworkUrl} alt={podcast.name} />
        </a>
      </RouteLink>
    )
  }
}