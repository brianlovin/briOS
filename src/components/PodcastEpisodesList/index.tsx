import React from 'react';
import { getPodcastEpisodes } from '../../data/podcast'
import { Ul, Li, LineClamp } from '~/components/Typography'
import LoadingSpinner from '../LoadingSpinner';
import defaultTheme from '../Theme';
import useSWR from 'swr';

export default function PodcastEpisodesList({ episodes }) {
  const initialData = episodes
  const { data, error } = useSWR('https://spec.fm/api/podcasts/1034/episodes', getPodcastEpisodes, { initialData })

  if (error) return null

  if (!data) {
    return (
      <div style={{ 
        padding: `${defaultTheme.space[8]}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <Ul>
      {data.slice(0, 4).map(ep => {
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