import React from 'react';
import { Ul, Li, LineClamp } from '~/components/Typography'
import LoadingSpinner from '../LoadingSpinner';
import defaultTheme from '../Theme';

export default function PodcastEpisodesList({ episodes }) {
  if (!episodes) {
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
    <Ul style={{ listStyleType: 'none', marginLeft: 0 }}>
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