import React, { useState } from 'react'
import VisibilitySensor from 'react-visibility-sensor'
import { MarkdownRenderer } from '~/components/MarkdownRenderer'
import { DetailContainer, DetailTitle, MediaContainer, Video } from './style'
import { DesignDetail } from '~/data/appDissections'

interface Props {
  detail: DesignDetail
}

export function DesignDetailMedia(props: Props) {
  const { detail } = props
  const [isVisible, setIsVisible] = useState(false)

  return (
    <VisibilitySensor
      partialVisibility
      onChange={(visible: boolean) => !isVisible && setIsVisible(visible)}
    >
      <DetailContainer data-cy="detail-media-container">
        <DetailTitle className="font-sans font-bold text-primary">
          {detail.title}
        </DetailTitle>
        <div className="prose">
          <MarkdownRenderer>{detail.description}</MarkdownRenderer>
        </div>

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
