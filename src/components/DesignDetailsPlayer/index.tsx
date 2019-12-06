import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import useDarkMode from 'use-dark-mode'
import { Card, ContentContainer } from './style'
import { PlayerFooter } from './components'
import LoadingSpinner from '../LoadingSpinner';

export default function LatestEpisode() {
  const [episode, setEpisode] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const { value } = useDarkMode(false, { storageKey: null, onChange: null })

  async function fetchEpisode() {
    setLoading(true)
    return await fetch('https://spec.fm/api/podcasts/1034/episodes')
      .then(res => {
        return res.json();
      })
      .then(res => {
        const episode = res.find(ep => !!ep.published);
        setLoading(false)
        setEpisode(episode)
      })
      .catch(() => {
        setLoading(false)
      });
  }

  if (!episode || loading) {
    return (
      <React.Fragment>
        <VisibilitySensor partialVisibility onChange={(visible) => visible && fetchEpisode()}>
          <Card data-cy="design-details-player">
            <ContentContainer>
              <LoadingSpinner />
            </ContentContainer>
          </Card>
        </VisibilitySensor>

        <PlayerFooter />
      </React.Fragment>
    );
  }

  const { sharing_url } = episode;
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

      <PlayerFooter />
    </React.Fragment>
  );
}