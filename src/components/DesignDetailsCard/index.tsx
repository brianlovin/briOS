import * as React from 'react';
import Link from 'next/link';
import { DesignDetailsPost } from '../../types';
import {
  Title,
  Container,
  CardContent,
  VideoPlayer,
  ImageContainer,
  Icon,
  DetailsCount,
  Arrow,
  Circle,
} from './style';
import ReactVisibilitySensor from 'react-visibility-sensor';

type Props = {
  post: DesignDetailsPost,
};


export default function DesignDetailsCard(props: Props) {
  const videoEl = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const {
    post: { title, slug, details, tint },
  } = props;
  
  const src = `/static/img/design-details/${slug}.jpeg`;
  
  const videosrc = details[1].media[0]

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
      <Link href="/design-details/[slug]" as={`/design-details/${slug}`}>
        <a>
          <Container onMouseEnter={play} onMouseLeave={pause}>
            <ImageContainer>
              <Icon alt={'Design Details'} src={src} />
            </ImageContainer>
            <CardContent>
              <Title>{title}</Title>
              <DetailsCount>{details.length} details</DetailsCount>
            </CardContent>
            <Circle color={tint} />
            <Arrow>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M12 5l7 7-7 7"/></svg>
            </Arrow>
            {isVisible && isMounted && !isMobile &&
              <VideoPlayer 
                playsInline
                muted
                ref={videoEl}
                loop
                autoPlay={false}
                preload="metadata"
                src={`${videosrc}#t=0.1`}
              />
            }
          </Container>
        </a>
      </Link>
    </ReactVisibilitySensor>
  );
}
