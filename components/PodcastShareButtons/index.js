// @flow
import * as React from 'react'
import type { ConfigPodcast } from '../../types'
import { FacebookButton, TwitterButton, CopyLinkButton } from '../Button'
import { Container } from './style'

type Props = {
  podcast: ConfigPodcast
}

class PodcastShareButtons extends React.Component<Props> {
  render() {
    const { podcast } = this.props

    return (
      <Container>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=https://spec.fm/podcasts/${podcast.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookButton>
            Share
          </FacebookButton>
        </a>

        <a
          href={`https://twitter.com/share?text=Listening to @${podcast.twitterUsername} on @specfm&url=https://spec.fm/podcasts/${podcast.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterButton>
            Tweet
          </TwitterButton>
        </a>

        <CopyLinkButton text={`https://spec.fm/podcasts/${podcast.slug}`}>
          Copy
        </CopyLinkButton>
      </Container>
    )
  }
}

export default PodcastShareButtons