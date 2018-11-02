// @flow
import * as React from 'react'
import PlayerContext from './context'
import Dismiss from '../Dismiss'
import Icon from '../Icon'
import { 
  Container,
  PodcastTitle, 
  EpisodeTitle, 
  DismissContainer, 
  IconContainer, 
  TextContainer, 
  Scrubber, 
  StyledAudioPlayer,
  SubscriptionsContainer,
  ContentContainer,
} from './style'
import SubscriptionButtons from './SubscriptionButtons';
import { podcasts } from '../../config'

class GlobalPlayer extends React.Component<{}> {
  render() {
    return (
      <PlayerContext.Consumer>
        {
          context => {
            const hasTrack = context.trackQueue.length > 0
            const queuedTrack = hasTrack ? context.trackQueue[0] : undefined
            const podcast = podcasts[0]
            
            return (
              <Container isVisible={hasTrack}>
                <DismissContainer>
                  <Dismiss color={theme => theme.border.default} onDismiss={context.clearQueue}><i>×</i></Dismiss>
                </DismissContainer>

                <ContentContainer>
                  {
                    hasTrack && queuedTrack && (
                      <IconContainer onClick={context.isPlaying ? context.pause : context.play}>
                        {
                          context.isPlaying
                          ? <Icon glyph="pause" />
                          : <Icon glyph="play" />
                        }
                      </IconContainer>
                    )
                  }
                  
                  {
                    hasTrack && queuedTrack && (
                      <TextContainer>
                        <a 
                          href={`https://spec.fm/podcasts/design-details/${queuedTrack.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <PodcastTitle>{podcast.name}</PodcastTitle> 
                        </a>
                        
                        <a 
                          href={`https://spec.fm/podcasts/design-details/${queuedTrack.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <EpisodeTitle>{queuedTrack.title}</EpisodeTitle>
                        </a>
                        
                        <StyledAudioPlayer
                          id="global-player-audio" 
                          autoPlay={true} 
                          src={queuedTrack.audio_url} 
                          controls={false} 
                          preload="none"
                          onEnded={context.onTrackEnded}
                          onTimeUpdate={context.onProgress}
                        ></StyledAudioPlayer>

                        <Scrubber 
                          type="range" 
                          min="0" 
                          max={queuedTrack.duration} 
                          onChange={context.scrub}
                          value={context.progress}
                        />
                      </TextContainer>
                    )
                  }
                </ContentContainer>

                {
                  podcast && 
                  <SubscriptionsContainer isVisible={true}>
                    <SubscriptionButtons podcast={podcast} />
                  </SubscriptionsContainer>
                }
              </Container>
            )
          }
        }
      </PlayerContext.Consumer>
    )
  }
}

export default GlobalPlayer