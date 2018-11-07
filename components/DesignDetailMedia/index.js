// @flow
import * as React from 'react'
import type { DesignDetail } from '../../types'
import VisibilitySensor from 'react-visibility-sensor'
import Markdown from '../Markdown'
import {
  DetailContainer,
  DetailTitle,
  MediaContainer,
  Video,
} from './style'

type Props = {
  detail: DesignDetail
}

class DesignDetailMedia extends React.Component<Props> {
  render() {
    const { detail } = this.props

    return (
      <DetailContainer>
        <DetailTitle>{detail.title}</DetailTitle>
        <Markdown>{detail.description}</Markdown>

        <MediaContainer>
          {
            detail.media.map(src => (
              <Video preload="auto" key={src} controls>
                <source src={src} />
              </Video>
            ))
          }
        </MediaContainer>
      </DetailContainer>
    )
  }
}

export default DesignDetailMedia