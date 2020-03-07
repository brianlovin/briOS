import React from 'react';
import { Ul, Li, LineClamp, P } from '~/components/Typography'
import LoadingSpinner from '../LoadingSpinner';
import defaultTheme from '../Theme';

export default function LatestEpisode() {
  const [episodes, setEpisodes] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  
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

  React.useEffect(() => {
    fetchEpisode()
  }, [])

  if (!episodes || loading) {
    return (
      <div style={{ padding: `${defaultTheme.space[4]} 0`}}>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <Ul>
      {episodes.slice(0, 4).map(ep => {
          return (
            <Li key={ep.id}>
              <a target="_blank" rel="noopener noreferrer" href={`https://spec.fm/podcasts/design-details/${ep.id}`}>
                {ep.title}
              </a>
              <LineClamp lines={2}>
                {ep.description}
              </LineClamp>
            </Li>
          )
        }
      )}
    </Ul>
  );
}