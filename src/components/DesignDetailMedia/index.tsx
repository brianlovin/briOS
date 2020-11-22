import React, { useState } from 'react'
import VisibilitySensor from 'react-visibility-sensor'
import Markdown from '~/components/MarkdownRenderer'
import { DetailContainer, DetailTitle, MediaContainer, Video } from './style'
import { DesignDetail } from '~/data/appDissections'

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
        <div style={{ padding: '8px' }} />
        <Markdown>{detail.description}</Markdown>

        {isVisible && (
          <MediaContainer className="bg-gray-100 dark:bg-gray-900">
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
