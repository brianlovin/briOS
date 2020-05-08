import React, { useState } from 'react'
import VisibilitySensor from 'react-visibility-sensor'
import Markdown from '~/components/MarkdownRenderer'
import { DetailContainer, DetailTitle, MediaContainer, Video } from './style'

export interface DesignDetail {
  title: string
  description: string
  media: Array<string>
  orientation?: 'landscape'
}

interface Props {
  detail: DesignDetail
}

export default function DesignDetailMedia(props: Props) {
  const { detail } = props
  const [isVisible, setIsVisible] = useState(false)

  return (
    <VisibilitySensor
      partialVisibility
      onChange={(visible: boolean) => !isVisible && setIsVisible(visible)}
    >
      <DetailContainer data-cy="detail-media-container">
        <DetailTitle>{detail.title}</DetailTitle>
        <Markdown>{detail.description}</Markdown>

        {isVisible && (
          <MediaContainer>
            {detail.media.map((src) => (
              <Video
                playsInline
                muted
                loop
                autoPlay
                preload="metadata"
                key={src}
                landscape={detail.orientation === 'landscape'}
              >
                <source src={`${src}#t=0.1`} />
              </Video>
            ))}
          </MediaContainer>
        )}
      </DetailContainer>
    </VisibilitySensor>
  )
}
