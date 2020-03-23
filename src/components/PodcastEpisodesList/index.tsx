import React from 'react';
import { Ul, Li, LineClamp } from '~/components/Typography'
import LoadingSpinner from '../LoadingSpinner';
import defaultTheme from '../Theme';

export default function PodcastEpisodesList({ episodes }) {
  return (
    <Ul style={{ listStyleType: 'none', marginLeft: 0 }}>
      {episodes.map(ep => {
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