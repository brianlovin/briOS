import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import useDarkMode from 'use-dark-mode'
import { podcasts } from '../../data';
import LoadingSpinner from '../LoadingSpinner';
import SubscriptionButtons from '../SubscriptionButtons'
import { Card, ContentContainer, EpisodeGrid, EpisodeCard, CardContent, Title, Date } from './style'

export default function LatestEpisode() {
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
      <React.Fragment>
        <VisibilitySensor partialVisibility onChange={(visible) => visible && fetchEpisode()}>
          <Card data-cy="design-details-player">
            <ContentContainer>
              <LoadingSpinner />
            </ContentContainer>
          </Card>
        </VisibilitySensor>
      </React.Fragment>
    );
  }

  const [featured, ...allEpisodes] = episodes
  const { sharing_url } = featured;
  const [, id] = sharing_url.split('s/');

  if (!id) return null;

  return (
    <React.Fragment>
      <Card data-cy="design-details-player">
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
      </Card>

      <SubscriptionButtons podcast={podcasts[0]} />

      <EpisodeGrid>
        {allEpisodes.slice(0,8).map(ep => (
          <a href={`https://spec.fm/podcasts/design-details/${ep.id}`}>
            <EpisodeCard>
              <CardContent>
                <Title>{ep.title}</Title>
                <Date>{ep.created_at}</Date>
              </CardContent>
            </EpisodeCard>
          </a>
        ))}
      </EpisodeGrid>
    </React.Fragment>
  );
}