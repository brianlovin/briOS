import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import useDarkMode from 'use-dark-mode'
import { getDateObject } from '~/lib/getDateObject'
import { podcast } from '~/data';
import LoadingSpinner from '~/components/LoadingSpinner';
import SubscriptionButtons from '~/components/SubscriptionButtons'
import { H4, P } from '~/components/Typography'
import { OuterContainer, PlayerContainer, ContentContainer, EpisodeCard, CardContent, Arrow, Circle, Date } from './style'
import { ContentGrid } from '../Page';

interface Props {
  showMoreEpisodes: boolean
}

export default function LatestEpisode({ showMoreEpisodes }: Props) {
  const [episodes, setEpisodes] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const { value } = useDarkMode(false, { storageKey: null, onChange: null })

  async function fetchEpisode() {
    setLoading(true)
    return await fetch('https://spec.fm/api/podcasts/1034/episodes')
      .then(res => {
        return res.json();
      })
      .then(res => {
        const episodes = res.filter(ep => !!ep.published);
        setLoading(false)
        setEpisodes(episodes)
      })
      .catch(() => {
        setLoading(false)
      });
  }

  if (!episodes || loading) {
    return (
      <VisibilitySensor partialVisibility onChange={(visible) => visible && fetchEpisode()}>
        <OuterContainer>
          <PlayerContainer data-cy="design-details-player">
            <ContentContainer>
              <LoadingSpinner />
            </ContentContainer>
          </PlayerContainer>
          <SubscriptionButtons podcast={podcast} />
        </OuterContainer>
      </VisibilitySensor>
    );
  }

  const [featured, ...allEpisodes] = episodes
  const { sharing_url } = featured;
  const [, id] = sharing_url.split('s/');

  if (!id) return null;

  return (
    <OuterContainer>
      <PlayerContainer data-cy="design-details-player">
        <ContentContainer>
          <iframe
            frameBorder="0"
            height="200px"
            scrolling="no"
            seamless
            src={`https://embed.simplecast.com/${id}?color=${value ? '3d3d3d' : 'f5f5f5'}`}
            width="100%"
            data-cy="latest-episode"
          />
        </ContentContainer>
      </PlayerContainer>

      <SubscriptionButtons podcast={podcast} />

      {showMoreEpisodes && (
        <ContentGrid>
          {allEpisodes.slice(0, 4).map(ep => {
            const { month, year, day } = getDateObject(ep.published_at);
            const datestring = `${month} ${day}, ${year}`;
            return (
              <a target="_blank" rel="noopener noreferrer" key={ep.id} href={`https://spec.fm/podcasts/design-details/${ep.id}`}>
                <EpisodeCard>
                  <CardContent>
                    <H4>{ep.title}</H4>
                    <P>{ep.description.split('.')[0].substring(0, 200).trim() + '...'}</P>
                    <Date>{datestring}</Date>
                  </CardContent>
                  <Circle color={podcast.colors.text} />
                  <Arrow>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M12 5l7 7-7 7"/></svg>
                  </Arrow>
                </EpisodeCard>
              </a>
            )}
          )}
        </ContentGrid>
      )}
    </OuterContainer>
  );
}