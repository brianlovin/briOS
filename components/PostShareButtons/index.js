// @flow
import * as React from 'react'
import type { DesignDetailsPost } from '../../types'
import { FacebookButton, TwitterButton, CopyLinkButton } from '../Button'
import { Container } from './style'

type Props = {
  post: DesignDetailsPost
}

class EpisodeShareButtons extends React.Component<Props> {
  render() {
    const { post } = this.props

    return (
      <Container>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=https://brianlovin.com/design-details/${post.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FacebookButton>
            Share
          </FacebookButton>
        </a>

        <a
          href={`https://twitter.com/share?text=Design Details: ${post.title} by @brian_lovin&url=https://brianlovin.com/design-details/${post.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterButton>
            Tweet
          </TwitterButton>
        </a>

        <CopyLinkButton text={`https://brianlovin.com/design-details/${post.slug}`}>
          Copy
        </CopyLinkButton>
      </Container>
    )
  }
}

export default EpisodeShareButtons