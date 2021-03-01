import * as React from 'react'
import ReactVisibilitySensor from 'react-visibility-sensor'
import Link from 'next/link'
import {
  Container,
  CardContent,
  VideoPlayer,
  ImageContainer,
  Arrow,
  Circle,
} from './style'
import Card from '~/components/Card'
import { DesignDetailsPostSummary } from '~/data/appDissections'
import Image from 'next/image'

interface Props {
  summary: DesignDetailsPostSummary
}

export default function DesignDetailsCard(props: Props) {
  const videoEl = React.useRef(null)
  const [isVisible, setIsVisible] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  const {
    summary: { title, slug, firstDetail, tint, detailsCount },
  } = props

  const videosrc = firstDetail.media[0]

  const pause = () => {
    videoEl.current && videoEl.current.pause()
  }

  const play = () => {
    videoEl.current && videoEl.current.play()
  }

  React.useEffect(() => {
    setIsMounted(true)
    setIsMobile(window.innerWidth <= 968)
  }, [])

  return (
    <ReactVisibilitySensor
      partialVisibility
      onChange={(visible) => visible && setIsVisible(true)}
    >
      <Link
        href="/design-details/[slug]"
        as={`/design-details/${slug}`}
        passHref
      >
        <a className="block">
          <Card className="lg:-mx-8">
            <Container onMouseEnter={play} onMouseLeave={pause}>
              <div className="flex items-center">
                <ImageContainer>
                  <Image
                    width={'56px'}
                    height={'56px'}
                    layout="fixed"
                    alt={'Design Details'}
                    src={`/static/img/design-details/${slug}.jpeg`}
                  />
                </ImageContainer>
                <CardContent>
                  <p className="font-sans font-semibold">{title}</p>
                  <p className="text-sm text-tertiary">
                    {detailsCount} details
                  </p>
                </CardContent>
              </div>
              <Circle color={tint} />
              <Arrow>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h13M12 5l7 7-7 7" />
                </svg>
              </Arrow>
              {isVisible && isMounted && !isMobile && (
                <VideoPlayer
                  playsInline
                  muted
                  ref={videoEl}
                  loop
                  autoPlay={false}
                  preload="metadata"
                  src={`${videosrc}#t=0.1`}
                />
              )}
            </Container>
          </Card>
        </a>
      </Link>
    </ReactVisibilitySensor>
  )
}
