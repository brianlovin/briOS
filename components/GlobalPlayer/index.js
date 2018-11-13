// @flow
// $FlowIssue
import React, { useContext } from 'react';
import PlayerContext from './context';
import Dismiss from '../Dismiss';
import Icon from '../Icon';
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
} from './style';
import SubscriptionButtons from './SubscriptionButtons';
import { podcasts } from '../../config';

export default function GlobalPlayer() {
  const context = useContext(PlayerContext);
  const {
    trackQueue,
    clearQueue,
    isPlaying,
    pause,
    play,
    scrub,
    onTrackEnded,
    progress,
    onProgress,
  } = context;

  const hasTrack = trackQueue.length > 0;
  const queuedTrack = hasTrack ? trackQueue[0] : undefined;
  const podcast = podcasts[0];

  return (
    <Container isVisible={hasTrack}>
      <DismissContainer>
        <Dismiss color={theme => theme.border.default} onDismiss={clearQueue}>
          <i>×</i>
        </Dismiss>
      </DismissContainer>

      <ContentContainer>
        {hasTrack && queuedTrack && (
          <IconContainer onClick={isPlaying ? pause : play}>
            {isPlaying ? <Icon glyph="pause" /> : <Icon glyph="play" />}
          </IconContainer>
        )}

        {hasTrack && queuedTrack && (
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
              autoPlay
              src={queuedTrack.audio_url}
              controls={false}
              preload="none"
              onEnded={onTrackEnded}
              onTimeUpdate={onProgress}
            />

            <Scrubber
              type="range"
              min="0"
              max={queuedTrack.duration}
              onChange={scrub}
              value={progress}
            />
          </TextContainer>
        )}
      </ContentContainer>

      {podcast && (
        <SubscriptionsContainer isVisible>
          <SubscriptionButtons podcast={podcast} />
        </SubscriptionsContainer>
      )}
    </Container>
  );
}
