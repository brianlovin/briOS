// @flow
import React from 'react';
import { getDateObject } from '../../lib/getDateObject';
import type { SimplecastEpisode } from '../../types';
import AtvImage from '../AtvImage';
import { podcasts } from '../../config';
import { SubscriptionsContainer } from '../GlobalPlayer/style';
import SubscriptionButtons from '../GlobalPlayer/SubscriptionButtons';
import EpisodePlayButton from '../EpisodePlayButton';
import { Artwork, Actions, AllEpsButton } from './style';

export const PlayerFooter = () => (
  <SubscriptionsContainer isVisible isFooter>
    <SubscriptionButtons podcast={podcasts[0]} />
  </SubscriptionsContainer>
);

export const PlayerArtwork = () => (
  <a
    href="https://spec.fm/podcasts/design-details"
    target="_blank"
    rel="noopener noreferrer"
  >
    <AtvImage
      alt="Design Details Podcast"
      src="/static/img/podcasts/designdetails.jpg"
      Component={Artwork}
    />
  </a>
);

type Props = { episode: ?SimplecastEpisode };
export const PlayerActions = (props: Props) => {
  const { episode } = props;
  return (
    <Actions>
      {episode && <EpisodePlayButton episode={episode} />}

      <a
        name="All Episodes"
        href="https://spec.fm/podcasts/design-details"
        target="_blank"
        rel="noopener noreferrer"
      >
        <AllEpsButton>All Episodes</AllEpsButton>
      </a>
    </Actions>
  );
};

export const getDateString = (episode: SimplecastEpisode) => {
  const { month, year, day } = getDateObject(episode.published_at);
  const datestring = `${month} ${day}, ${year}`;
  return datestring;
};
