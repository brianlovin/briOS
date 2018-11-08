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

type State = {
  isVisible: boolean
}

class DesignDetailMedia extends React.Component<Props, State> {
  state = { isVisible: false }

  onChange = (isVisible: boolean) => {
    if (this.state.isVisible) return
    return this.setState({ isVisible })
  }

  render() {
    const { detail } = this.props
    const { isVisible } = this.state

    return (
      <VisibilitySensor partialVisibility onChange={this.onChange}>
        <DetailContainer>
          <DetailTitle>{detail.title}</DetailTitle>
          <Markdown>{detail.description}</Markdown>

            {
              isVisible
              ? (
                <MediaContainer>
                  {
                    detail.media.map(src => (
                      <Video playsInline muted loop autoPlay preload="metadata" key={src}>
                        <source src={`${src}#t=0.1`} />
                      </Video>
                    ))
                  }
                </MediaContainer>
              )
              : <span />
            }
        </DetailContainer>
      </VisibilitySensor>
    )
  }
}

export default DesignDetailMedia