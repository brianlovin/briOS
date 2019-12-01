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

type Props = {
  post: DesignDetailsPost,
};


export default function DesignDetailsCard(props: Props) {
  const videoEl = React.useRef(null);
  const {
    post: { title, slug, details, tint },
  } = props;
  
  const src = `/static/img/design-details/${slug}.jpeg`;
  
  const videosrc = details[0].media[0]

  const pause = () => {
    videoEl.current.pause()
  }

  const play = () => {
    videoEl.current.play()
  }

  return (
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
          <VideoPlayer 
            playsInline
            muted
            ref={videoEl}
            loop
            autoPlay={false}
            preload="metadata"
            src={`${videosrc}#t=0.1`}
          / >
        </Container>
      </a>
    </Link>
  );
}
